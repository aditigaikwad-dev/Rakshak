import { useEffect, useMemo, useState } from 'react';
import LineChart from '../components/charts/LineChart';
import ChartWrapper from '../components/ui/ChartWrapper';
import Card from '../components/ui/Card';
import { ErrorState, Loader } from '../components/ui/Loader';
import { useWorkers } from '../hooks/useWorkers';
import { workerService } from '../services/workerService';

export default function WorkerProfiles() {
  const { workers, loading, error, fetchWorkers } = useWorkers();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [trend, setTrend] = useState({ labels: [], hr: [], spo2: [], temperature: [] });
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [assignedJackets, setAssignedJackets] = useState({});
  const [message, setMessage] = useState('');

  const selectedWorker = workers.find((worker) => worker.id === selectedId) || workers[0];

  useEffect(() => {
    if (workers.length && !selectedId) {
      setSelectedId(workers[0].id);
    }
  }, [workers, selectedId]);

  useEffect(() => {
    if (!selectedWorker) return;
    workerService.getWorkerHealthTrend(selectedWorker.id).then(setTrend);
    setContactName(selectedWorker.emergencyContact?.name || '');
    setContactPhone(selectedWorker.emergencyContact?.phone || '');
  }, [selectedWorker]);

  const filteredWorkers = useMemo(
    () =>
      workers.filter((worker) => {
        const q = search.toLowerCase();
        return worker.name.toLowerCase().includes(q) || worker.id.toLowerCase().includes(q);
      }),
    [workers, search]
  );

  const updateJacket = async () => {
    if (!selectedWorker) return;
    const currentJacket = assignedJackets[selectedWorker.id] || selectedWorker.jacketId;
    const nextJacket = `${currentJacket}-NEW`;
    await workerService.assignJacket(selectedWorker.id, nextJacket);
    setAssignedJackets((prev) => ({ ...prev, [selectedWorker.id]: nextJacket }));
    setMessage(`Assigned jacket ${nextJacket} to ${selectedWorker.name}.`);
  };

  const saveEmergencyContact = async () => {
    if (!selectedWorker) return;
    await workerService.updateEmergencyContact(selectedWorker.id, {
      name: contactName,
      phone: contactPhone
    });
    setMessage(`Emergency contact saved for ${selectedWorker.name}.`);
  };

  if (loading) return <Loader rows={4} />;
  if (error) return <ErrorState message={error} onRetry={fetchWorkers} />;

  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr,1fr]">
      <Card className="overflow-hidden" hover>
        <div className="border-b border-slate-800 p-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by worker name or ID"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead className="bg-slate-900/70 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Worker</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3">Jacket</th>
                <th className="px-4 py-3">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker) => (
                <tr
                  key={worker.id}
                  onClick={() => setSelectedId(worker.id)}
                  className={`cursor-pointer border-t border-slate-800 transition hover:bg-slate-800/40 ${
                    selectedWorker?.id === worker.id ? 'bg-slate-800/50' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-slate-100">{worker.name}</td>
                  <td className="px-4 py-3 text-slate-300">{worker.id}</td>
                  <td className="px-4 py-3 text-slate-300">{worker.ward}</td>
                  <td className="px-4 py-3 text-slate-300">{worker.jacketId}</td>
                  <td className="px-4 py-3 text-slate-300">{worker.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedWorker && (
        <div className="space-y-4">
          <Card className="p-4" hover>
            <h3 className="text-sm font-semibold text-slate-100">{selectedWorker.name}</h3>
            <p className="mt-1 text-xs text-slate-400">{selectedWorker.id}</p>
            <p className="mt-1 text-xs text-slate-400">
              Jacket: {assignedJackets[selectedWorker.id] || selectedWorker.jacketId}
            </p>
            <p className="mt-3 text-xs text-slate-400">Emergency Contact</p>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact name"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Contact phone"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />

            <button
              type="button"
              onClick={updateJacket}
              className="mt-4 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
            >
              Assign Jacket
            </button>
            <button
              type="button"
              onClick={saveEmergencyContact}
              className="mt-2 w-full rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
            >
              Save Emergency Contact
            </button>

            {message ? <p className="mt-2 text-xs text-emerald-300">{message}</p> : null}
          </Card>

          <ChartWrapper title="Health Trends" subtitle="Last 5 hours">
            <LineChart
              labels={trend.labels}
              datasets={[
                { label: 'HR', data: trend.hr, borderColor: '#EF4444', backgroundColor: '#EF4444', tension: 0.35 },
                { label: 'SpO2', data: trend.spo2, borderColor: '#10B981', backgroundColor: '#10B981', tension: 0.35 },
                {
                  label: 'Temperature',
                  data: trend.temperature,
                  borderColor: '#F59E0B',
                  backgroundColor: '#F59E0B',
                  tension: 0.35
                }
              ]}
            />
          </ChartWrapper>
        </div>
      )}
    </section>
  );
}
