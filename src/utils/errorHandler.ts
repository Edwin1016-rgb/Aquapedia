import { showToast } from '../store/uiStore';

export function handleError(err: unknown, context?: string) {
  // Centralized error handling: log and notify user
  // eslint-disable-next-line no-console
  console.error('[handleError]', context ?? '', err);
  try {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    showToast('error', message);
  } catch (e) {
    // swallow
  }
}

export default handleError;
