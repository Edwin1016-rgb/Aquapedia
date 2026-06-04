import { useCallback } from 'react';

export function useCamera() {
  const open = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      try {
        (input as any).capture = 'environment';
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

  return { open };
}
