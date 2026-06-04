import React from 'react';

type Props = {
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
};

export default function Modal({ title, children, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-4">
        {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>}
        <div className="text-gray-700 dark:text-gray-300">{children}</div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}