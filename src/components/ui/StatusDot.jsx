import clsx from 'clsx';

const dotClassBySeverity = {
  NORMAL: 'bg-emerald-400',
  SAFE: 'bg-emerald-400',
  WARNING: 'bg-amber-400',
  DANGER: 'bg-red-400',
  CRITICAL: 'bg-violet-400 animate-ping-slow'
};

export default function StatusDot({ severity = 'NORMAL', className = '' }) {
  return (
    <span className={clsx('relative inline-flex h-2.5 w-2.5', className)}>
      {severity === 'CRITICAL' && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-70 animate-ping" />
      )}
      <span className={clsx('relative inline-flex h-2.5 w-2.5 rounded-full', dotClassBySeverity[severity])} />
    </span>
  );
}
