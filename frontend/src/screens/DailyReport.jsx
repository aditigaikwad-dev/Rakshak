import { useEffect, useState } from 'react';
import BarChart from '../components/charts/BarChart';
import ChartWrapper from '../components/ui/ChartWrapper';
import Card from '../components/ui/Card';
import { ErrorState, Loader } from '../components/ui/Loader';
import { alertService } from '../services/alertService';
import { reportService } from '../services/reportService';

export default function DailyReport() {
  const [report, setReport] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [reportRes, hourlyRes] = await Promise.all([
        reportService.getDailyReport(),
        alertService.getHourlyAlertSeries()
      ]);
      setReport(reportRes);
      setHourly(hourlyRes);
    } catch (err) {
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loader rows={4} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card className="p-4" hover>
          <p className="text-xs text-slate-400">Active Workers</p>
          <p className="mt-2 text-2xl font-bold text-slate-50">{report.summary.activeWorkers}</p>
        </Card>
        <Card className="p-4" hover>
          <p className="text-xs text-slate-400">High Risk Zones</p>
          <p className="mt-2 text-2xl font-bold text-amber-300">{report.summary.highRiskZones}</p>
        </Card>
        <Card className="p-4" hover>
          <p className="text-xs text-slate-400">Total Alerts</p>
          <p className="mt-2 text-2xl font-bold text-red-300">{report.summary.totalAlerts}</p>
        </Card>
        <Card className="p-4" hover>
          <p className="text-xs text-slate-400">Resolved Rate</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">
            {Math.round(report.summary.resolvedRate * 100)}%
          </p>
        </Card>
        <Card className="p-4" hover>
          <p className="text-xs text-slate-400">Critical Alerts</p>
          <p className="mt-2 text-2xl font-bold text-violet-300">{report.summary.criticalAlerts}</p>
        </Card>
      </div>

      <ChartWrapper title="Alerts by Hour" subtitle="Past 24 hours">
        <BarChart
          labels={Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)}
          values={hourly}
          label="Alerts"
          color="#EF4444"
        />
      </ChartWrapper>

      <Card className="overflow-x-auto p-4" hover>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">Alert Table</h3>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-slate-700"
          >
            Generate PDF
          </button>
        </div>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="pb-2">Alert</th>
              <th className="pb-2">Worker</th>
              <th className="pb-2">Severity</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {report.alertsTable.map((item) => (
              <tr key={item.id} className="border-t border-slate-800 text-slate-300">
                <td className="py-2">{item.type}</td>
                <td className="py-2">{item.workerName}</td>
                <td className="py-2">{item.severity}</td>
                <td className="py-2">{item.status}</td>
                <td className="py-2">{new Date(item.createdAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
