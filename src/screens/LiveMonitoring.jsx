import { useMemo, useState } from 'react';
import { Bell, BellOff, PauseCircle, PlayCircle, Search } from 'lucide-react';
import MapView from '../components/map/MapView';
import WorkerCard from '../components/worker/WorkerCard';
import { EmptyState, ErrorState, Loader } from '../components/ui/Loader';
import { useAlerts } from '../hooks/useAlerts';
import { useSocket } from '../hooks/useSocket';
import { useWorkers } from '../hooks/useWorkers';

const playDangerTone = () => {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 440;
  gain.gain.value = 0.03;
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start();
  setTimeout(() => {
    osc.stop();
    context.close();
  }, 220);
};

export default function LiveMonitoring() {
  const { workers, loading, error, fetchWorkers, applyRealtimeUpdate } = useWorkers();
  const { addRealtimeAlert } = useAlerts();
  const [filterType, setFilterType] = useState('ALL');
  const [ward, setWard] = useState('ALL');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [search, setSearch] = useState('');
  const [realtimePaused, setRealtimePaused] = useState(false);
  const [muted, setMuted] = useState(false);

  useSocket({
    enabled: !realtimePaused,
    onWorkerUpdate: applyRealtimeUpdate,
    onAlertEvent: (payload) => {
      addRealtimeAlert(payload);
      if (!muted && (payload.severity === 'DANGER' || payload.severity === 'CRITICAL')) {
        playDangerTone();
      }
    }
  });

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      if (filterType === 'ALERTS' && !['WARNING', 'DANGER', 'CRITICAL'].includes(worker.severity)) {
        return false;
      }
      if (ward !== 'ALL' && worker.ward !== ward) {
        return false;
      }
      if (
        search &&
        !worker.name.toLowerCase().includes(search.toLowerCase()) &&
        !worker.id.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [workers, filterType, ward, search]);

  const wards = [...new Set(workers.map((worker) => worker.ward))];
  const selectedWorker = workers.find((worker) => worker.id === selectedWorkerId) || filteredWorkers[0];

  const stats = useMemo(
    () => ({
      total: workers.length,
      alerts: workers.filter((worker) => ['WARNING', 'DANGER', 'CRITICAL'].includes(worker.severity)).length,
      critical: workers.filter((worker) => worker.severity === 'CRITICAL').length,
      avgBattery: workers.length
        ? Math.round(workers.reduce((sum, worker) => sum + worker.battery, 0) / workers.length)
        : 0
    }),
    [workers]
  );

  if (loading) return <Loader rows={4} />;
  if (error) return <ErrorState message={error} onRetry={fetchWorkers} />;

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Workers Online</p>
          <p className="mt-2 text-2xl font-bold text-slate-50">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
          <p className="kpi-label kpi-label-warning text-[11px] uppercase tracking-wide">Active Alerts</p>
          <p className="kpi-value kpi-value-warning mt-2 text-2xl font-bold">{stats.alerts}</p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
          <p className="kpi-label kpi-label-critical text-[11px] uppercase tracking-wide">Critical</p>
          <p className="kpi-value kpi-value-critical mt-2 text-2xl font-bold">{stats.critical}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
          <p className="kpi-label kpi-label-safe text-[11px] uppercase tracking-wide">Avg Battery</p>
          <p className="kpi-value kpi-value-safe mt-2 text-2xl font-bold">{stats.avgBattery}%</p>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.3fr,1fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterType === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType('ALERTS')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterType === 'ALERTS'
                ? 'bg-red-500/20 text-red-200 ring-1 ring-red-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Alerts Only
          </button>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none"
          >
            <option value="ALL">All Wards</option>
            {wards.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <div className="relative min-w-[210px] flex-1">
            <Search size={14} className="pointer-events-none absolute left-2 top-2.5 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search worker"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-1.5 pl-7 pr-2 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setRealtimePaused((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            {realtimePaused ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
            {realtimePaused ? 'Resume Live' : 'Pause Live'}
          </button>

          <button
            type="button"
            onClick={() => setMuted((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            {muted ? <BellOff size={14} /> : <Bell size={14} />}
            {muted ? 'Muted' : 'Sound On'}
          </button>
        </div>

        <MapView
          workers={filteredWorkers}
          selectedWorkerId={selectedWorker?.id}
          onSelectWorker={setSelectedWorkerId}
        />

        {selectedWorker ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300">
            <p className="text-slate-400">Selected Worker</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">
              {selectedWorker.name} ({selectedWorker.id})
            </p>
            <p className="mt-1">Ward {selectedWorker.ward} | Battery {selectedWorker.battery}%</p>
          </div>
        ) : null}
      </div>

      <div className="h-[640px] space-y-3 overflow-y-auto pr-1">
        {filteredWorkers.length === 0 ? (
          <EmptyState title="No workers match filter" subtitle="Try another ward or include all statuses." />
        ) : (
          filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              highlighted={worker.severity === 'DANGER' || worker.severity === 'CRITICAL'}
              selected={selectedWorker?.id === worker.id}
              onSelect={() => setSelectedWorkerId(worker.id)}
              onViewMap={() => setSelectedWorkerId(worker.id)}
            />
          ))
        )}
      </div>
      </section>
    </section>
  );
}
