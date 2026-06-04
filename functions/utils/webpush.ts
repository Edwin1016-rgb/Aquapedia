// Web Push via Web Crypto API (no Node.js built-ins)
// Based on RFC 8291 (VAPID) and RFC 8188 (HTTP ECE aes128gcm)

function base64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(s: string): ArrayBuffer {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const b = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
  return b.buffer;
}

// HKDF-SHA256 (RFC 5869)
async function hkdf(salt: ArrayBuffer, ikm: ArrayBuffer, info: Uint8Array, len: number): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey('raw', salt, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const prk = await crypto.subtle.sign('HMAC', key, ikm);
  const macKey = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const blocks: Uint8Array[] = [];
  let t = new Uint8Array(0);
  for (let i = 1; blocks.reduce((s, b) => s + b.length, 0) < len; i++) {
    const input = new Uint8Array(t.length + info.length + 1);
    input.set(t);
    input.set(info, t.length);
    input[input.length - 1] = i;
    t = new Uint8Array(await crypto.subtle.sign('HMAC', macKey, input));
    blocks.push(t);
  }
  const out = new Uint8Array(len);
  let off = 0;
  for (const b of blocks) {
    const take = Math.min(b.length, len - off);
    out.set(b.slice(0, take), off);
    off += take;
    if (off >= len) break;
  }
  return out.buffer;
}

// ECDSA DER signature → raw r||s (64 bytes)
function derToRaw(der: ArrayBuffer): ArrayBuffer {
  const d = new Uint8Array(der);
  let p = 2; // skip 0x30, len
  p += 1; // 0x02
  const rLen = d[p++];
  const r = d.slice(p, p + rLen); p += rLen;
  p += 1; // 0x02
  const sLen = d[p++];
  const s = d.slice(p, p + sLen);
  const pad = (v: Uint8Array, n: number) => {
    if (v.length === n) return v;
    const out = new Uint8Array(n);
    out.set(v.length > n ? v.slice(v.length - n) : v, v.length > n ? 0 : n - v.length);
    return out;
  };
  const raw = new Uint8Array(64);
  raw.set(pad(r, 32));
  raw.set(pad(s, 32), 32);
  return raw.buffer;
}

// Generate VAPID JWT (ES256) using JWK format
async function vapidJWT(
  aud: string, sub: string, privKeyB64: string, pubKeyB64: string,
): Promise<{ jwt: string; pkB64: string }> {
  const enc = new TextEncoder();
  const h = base64url(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const p = base64url(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 86400, sub })));
  const input = `${h}.${p}`;

  const rawPriv = new Uint8Array(base64urlDecode(privKeyB64));
  const rawPub = new Uint8Array(base64urlDecode(pubKeyB64));
  // rawPub: 0x04 || x(32) || y(32)
  const x = rawPub.slice(1, 33);
  const y = rawPub.slice(33, 65);

  const jwk: JsonWebKey = {
    kty: 'EC',
    crv: 'P-256',
    d: base64url(rawPriv),
    x: base64url(x),
    y: base64url(y),
  };

  const pk = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = derToRaw(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, pk, enc.encode(input)));
  return { jwt: `${input}.${base64url(sig)}`, pkB64: pubKeyB64 };
}

// HTTP ECE aes128gcm encrypt
async function eceEncrypt(
  plaintext: string,
  subPubKey: ArrayBuffer, // 65-byte raw uncompressed point
  subAuth: ArrayBuffer,
  ephPriv: CryptoKey,
  ephPub: ArrayBuffer,   // 65-byte raw uncompressed point
): Promise<ArrayBuffer> {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // ECDH shared secret
  const pub = await crypto.subtle.importKey('raw', subPubKey, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
  const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: pub }, ephPriv, 256);

  // PRK = HMAC-SHA256(auth, shared)
  const authKey = await crypto.subtle.importKey('raw', subAuth, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const prk = await crypto.subtle.sign('HMAC', authKey, shared);

  // CEK = HKDF(prk, salt, "Content-Encoding: aes128gcm\0", 16)
  const cekInfo = new TextEncoder().encode('Content-Encoding: aes128gcm\0');
  const cek = await hkdf(salt, prk, cekInfo, 16);

  // Nonce = HKDF(prk, salt, "Content-Encoding: nonce\0", 12)
  const nonceInfo = new TextEncoder().encode('Content-Encoding: nonce\0');
  const nonce = new Uint8Array(await hkdf(salt, prk, nonceInfo, 12));

  // Encrypt padded payload with AES-128-GCM
  const pt = new TextEncoder().encode(plaintext);
  const padded = new Uint8Array(2 + pt.length);
  padded[0] = 0; padded[1] = 0; // padding delimiter
  padded.set(pt, 2);

  const encKey = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce, tagLength: 128 }, encKey, padded);

  // Output: salt(16) + rs(4 BE) + key_id(65 raw pub) + ciphertext+tag(variable)
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, padded.length + 16, false);

  const out = new Uint8Array(16 + 4 + 65 + ciphertext.byteLength);
  out.set(salt, 0);
  out.set(rs, 16);
  out.set(new Uint8Array(ephPub), 20);
  out.set(new Uint8Array(ciphertext), 85);
  return out.buffer;
}

export interface PushSub {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export async function sendWebPush(
  sub: PushSub,
  payload: string | null,
  vapid: { publicKey: string; privateKey: string; subject: string },
): Promise<{ ok: boolean; status: number }> {
  const u = new URL(sub.endpoint);
  const { jwt, pkB64 } = await vapidJWT(`${u.protocol}//${u.host}`, vapid.subject, vapid.privateKey, vapid.publicKey);

  const headers: Record<string, string> = {
    TTL: '86400',
    Authorization: `vapid t=${jwt}, k=${pkB64}`,
  };

  let body: ArrayBuffer | undefined;

  if (payload) {
    const ephPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
    const ephPub = await crypto.subtle.exportKey('raw', ephPair.publicKey) as ArrayBuffer;
    const encrypted = await eceEncrypt(payload, base64urlDecode(sub.p256dh), base64urlDecode(sub.auth), ephPair.privateKey, ephPub);
    headers['Content-Encoding'] = 'aes128gcm';
    headers['Content-Type'] = 'application/octet-stream';
    body = encrypted;
  }

  const res = await fetch(sub.endpoint, { method: 'POST', headers, body: body ?? null });
  return { ok: res.status < 400, status: res.status };
}

export async function sendWebPushAll(
  subs: PushSub[],
  payload: string | null,
  vapid: { publicKey: string; privateKey: string; subject: string },
): Promise<{ sent: number; total: number }> {
  const results = await Promise.allSettled(subs.map((s) => sendWebPush(s, payload, vapid)));
  return { sent: results.filter((r) => r.status === 'fulfilled' && r.value.ok).length, total: subs.length };
}
