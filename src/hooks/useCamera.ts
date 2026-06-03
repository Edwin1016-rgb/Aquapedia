import { useCallback } from 'react';
import { uploadImage } from '../services/storageService';

export function useCamera() {
  const open = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      // capture is not in TS lib types for HTMLInputElement
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        input.capture = 'environment';
      } catch {}

      input.style.display = 'none';
      document.body.appendChild(input);
      input.addEventListener('change', () => {
        const f = input.files && input.files.length ? input.files[0] : null;
        resolve(f);
        setTimeout(() => document.body.removeChild(input), 200);
      });

      input.click();
    });
  }, []);

  const upload = useCallback(async (userId: string, file: File) => {
    return uploadImage(userId, file);
  }, []);

  return { open, upload } as const;
}
