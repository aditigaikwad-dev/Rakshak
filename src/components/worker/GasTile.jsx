import clsx from 'clsx';
import { GAS_THRESHOLDS } from '../../constants/colors';

const gasStateClass = (name, value) => {
  const t = GAS_THRESHOLDS[name];
  if (!t) return 'border-slate-700 bg-slate-800/60 text-slate-100';

  if (t.inverse) {
    if (value <= t.critical) return 'border-violet-500/60 bg-violet-500/10 text-violet-300';
    if (value <= t.danger) return 'border-red-500/60 bg-red-500/10 text-red-300';
    if (value <= t.warning) return 'border-amber-500/60 bg-amber-500/10 text-amber-300';
    return 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
  }

  if (value >= t.critical) return 'border-violet-500/60 bg-violet-500/10 text-violet-300';
  if (value >= t.danger) return 'border-red-500/60 bg-red-500/10 text-red-300';
  if (value >= t.warning) return 'border-amber-500/60 bg-amber-500/10 text-amber-300';
  return 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
};

export default function GasTile({ name, value }) {
  return (
    <div className={clsx('rounded-xl border px-3 py-2 transition', gasStateClass(name, value))}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{name}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
