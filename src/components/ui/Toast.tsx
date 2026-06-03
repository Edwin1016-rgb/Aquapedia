import useUiStore from '../../store/uiStore';

const typeClasses: Record<string, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-black',
  info: 'bg-sky-500 text-white',
};

export default function Toast() {
  const toasts = useUiStore((s) => s.toasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            `max-w-xs w-full px-4 py-2 rounded-md shadow-md animate-slide-in ${typeClasses[t.type] ?? typeClasses.info}`
          }
          role="status"
          aria-live="polite"
        >
          <div className="text-sm">{t.message}</div>
        </div>
      ))}
    </div>
  );
}
