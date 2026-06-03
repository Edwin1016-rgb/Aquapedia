import React from 'react';
import useUiStore, { type Theme } from '../../store/uiStore';

const DarkToggle: React.FC = () => {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  const cycle = async () => {
    const order: Theme[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    await setTheme(next);
  };

  return (
    <button
      aria-label="Cambiar tema"
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
      onClick={cycle}
    >
      {theme === 'system' ? 'Tema: Sistema' : theme === 'light' ? 'Tema: Claro' : 'Tema: Oscuro'}
    </button>
  );
};

export default DarkToggle;
