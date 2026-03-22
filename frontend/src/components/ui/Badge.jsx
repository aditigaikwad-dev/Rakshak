import clsx from 'clsx';
import { SEVERITY_TAILWIND } from '../../constants/colors';

export default function Badge({ value, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        SEVERITY_TAILWIND[value] || 'text-slate-300 border-slate-600 bg-slate-700/30',
        className
      )}
    >
      {value}
    </span>
  );
}
