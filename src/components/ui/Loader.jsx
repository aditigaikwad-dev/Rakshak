import Card from './Card';

export function Loader({ rows = 3 }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <Card className="animate-pulse p-4" key={idx}>
          <div className="h-4 w-1/3 rounded bg-slate-800" />
          <div className="mt-3 h-3 w-2/3 rounded bg-slate-800" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-800" />
        </Card>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Card className="p-8 text-center">
      <p className="text-sm text-red-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
      >
        Retry
      </button>
    </Card>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <Card className="p-8 text-center">
      <p className="text-sm font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </Card>
  );
}
