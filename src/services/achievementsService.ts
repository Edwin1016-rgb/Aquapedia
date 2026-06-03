import { db } from '../db/indexedDB';
import type { CollectionCard, Fish } from '../types';
import { useAchievementsStore } from '../store/achievementsStore';
import { showToast } from '../store/uiStore';
import { supabase } from './supabase';

const BADGES = {
  starter: { id: 'starter', name: 'Primer pez', description: 'Has añadido tu primera carta.' },
  collector_10: { id: 'collector_10', name: 'Coleccionista 10', description: 'Has añadido 10 cartas a tu colección.' },
  epic_hunter: { id: 'epic_hunter', name: 'Cazador Épico', description: 'Has conseguido una carta épica.' },
};

export async function evaluateAchievementsForUser(userId: string, addedCard: CollectionCard) {
  try {
    const count = await db.collection.where('userId').equals(userId).count();

    const unlock = useAchievementsStore.getState().unlockBadge;

    if (count === 1) {
      unlock(BADGES.starter);
      showToast('success', `Logro desbloqueado: ${BADGES.starter.name}`);
      await persistBadgeToProfile(userId, BADGES.starter);
    }

    if (count === 10) {
      unlock(BADGES.collector_10);
      showToast('success', `Logro desbloqueado: ${BADGES.collector_10.name}`);
      await persistBadgeToProfile(userId, BADGES.collector_10);
    }

    // check if the added card corresponds to an epic fish
    if (addedCard.fish) {
      const fish = addedCard.fish as Fish;
      if (fish.rarity === 'epico') {
        unlock(BADGES.epic_hunter);
        showToast('success', `Logro desbloqueado: ${BADGES.epic_hunter.name}`);
        await persistBadgeToProfile(userId, BADGES.epic_hunter);
      }
    }
  } catch (err) {
    // ignore errors
    // eslint-disable-next-line no-console
    console.error('evaluateAchievementsForUser', err);
  }
}

export default { evaluateAchievementsForUser };

async function persistBadgeToProfile(userId: string, badge: { id: string; name: string; description: string }) {
  try {
    // fetch existing badges from profile
    const { data, error } = await supabase.from('profiles').select('badges').eq('id', userId).single();
    if (error && (error as any).code !== 'PGRST116') {
      // if other error, log and return
      console.error('fetch profile badges error', error);
    }

    const existing: any[] = (data && (data as any).badges) || [];
    const exists = existing.find((b) => b.id === badge.id);
    if (exists) return;

    const newBadge = { ...badge, unlockedAt: new Date().toISOString() };
    const updated = [...existing, newBadge];

    const { error: upsertErr } = await supabase.from('profiles').upsert({ id: userId, badges: updated }, { onConflict: 'id' });
    if (upsertErr) console.error('upsert profile badges error', upsertErr);
  } catch (err) {
    // ignore failures
    // eslint-disable-next-line no-console
    console.error('persistBadgeToProfile', err);
  }
}
