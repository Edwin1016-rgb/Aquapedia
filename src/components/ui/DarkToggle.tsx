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
      className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      onClick={cycle}
      title={theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Oscuro'}
    >
      {theme === 'dark' ? (
        <i className="fa-solid fa-moon text-amber-400"></i>
      ) : theme === 'light' ? (
        <i className="fa-solid fa-sun text-amber-500"></i>
      ) : (
        <i className="fa-solid fa-circle-half-stroke text-gray-600 dark:text-gray-300"></i>
      )}
    </button>
  );
};

export default DarkToggle;
