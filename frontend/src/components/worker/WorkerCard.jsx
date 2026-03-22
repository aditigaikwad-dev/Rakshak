import { Battery, Clock3, IdCard } from 'lucide-react';
import { getTimeToDanger } from '../../utils/timeToDanger';
import { formatRelative } from '../../utils/formatters';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import StatusDot from '../ui/StatusDot';
import GasTile from './GasTile';
import HealthStats from './HealthStats';

export default function WorkerCard({
  worker,
  highlighted = false,
  selected = false,
  onSelect,
  onViewMap
}) {
  const timeToDanger = getTimeToDanger(worker);

  return (
    <Card
      hover
      className={`cursor-pointer p-4 transition ${
        highlighted ? 'border-red-500/40 bg-red-500/5 shadow-[0_0_0_1px_rgba(239,68,68,.25)]' : ''
      } ${
        selected ? 'ring-2 ring-emerald-400/50 shadow-[0_0_0_1px_rgba(16,185,129,.2)]' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <StatusDot severity={worker.severity} />
            <h3 className="text-sm font-semibold text-slate-100">{worker.name}</h3>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <IdCard size={13} /> {worker.id}
            </span>
            <span className="inline-flex items-center gap-1">
              <Battery size={13} /> {worker.battery}%
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={13} /> {formatRelative(worker.updatedAt)}
            </span>
          </div>
        </div>
        <Badge value={worker.severity} />
      </div>

      {typeof timeToDanger === 'number' && timeToDanger < 600 && worker.severity !== 'NORMAL' && (
        <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Time to Danger: approximately {Math.max(0, Math.round(timeToDanger / 60))} minutes
        </div>
      )}

      {worker.emergencySignal ? (
        <div className="mt-2 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200">
          Emergency Signal: Biometric anomaly detected. Immediate supervisor intervention required.
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-5 gap-2">
        {Object.entries(worker.gases).map(([name, value]) => (
          <GasTile key={name} name={name} value={value} />
        ))}
      </div>

      <div className="mt-3">
        <HealthStats
          health={worker.health}
          healthStatus={worker.healthStatus}
          immobilitySeconds={worker.immobilitySeconds}
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.();
          }}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
        >
          Inspect
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onViewMap?.();
          }}
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
        >
          Focus on Map
        </button>
      </div>
    </Card>
  );
}
