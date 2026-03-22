import Card from './Card';

export default function ChartWrapper({ title, subtitle, actions, children }) {
  return (
    <Card className="p-4 md:p-5" hover>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle ? <p className="text-xs text-slate-400">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </Card>
  );
}
