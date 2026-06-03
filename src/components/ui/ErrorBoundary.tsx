import React from 'react';
import { showToast } from '../../store/uiStore';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: unknown) {
    // Log and show minimal UI notification
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
    showToast('error', 'Ha ocurrido un error inesperado.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md text-center bg-white dark:bg-slate-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Ups — Algo salió mal</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Recarga la página o vuelve a la pantalla principal.</p>
            <div className="flex justify-center gap-3">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded" onClick={() => window.location.reload()}>Recargar</button>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded" onClick={() => (window.location.href = '/')}>Ir al inicio</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
