type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function Input({ value, onChange, placeholder, className }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={
        (className ?? '') +
        ' w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600'
      }
    />
  );
}