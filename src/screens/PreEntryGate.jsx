import { useEffect, useState } from 'react';
import BarChart from '../components/charts/BarChart';
import ChartWrapper from '../components/ui/ChartWrapper';
import { ErrorState, Loader } from '../components/ui/Loader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { alertService } from '../services/alertService';

export default function PreEntryGate() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [approverName, setApproverName] = useState('Control Room Supervisor');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await alertService.getGateChecks();
      setChecks(data);
    } catch (err) {
      setError(err.message || 'Failed to load gate checks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approveEntry = async (manholeId, status) => {
    const sanitizedApprover = approverName.trim();
    if (!sanitizedApprover) {
      setMessage('Please enter approver name before approving entry.');
      return;
    }

    let overrideReason = '';
    if (status === 'DANGEROUS') {
      const confirmed = window.confirm('This location is AI-classified as DANGEROUS. Approve entry override anyway?');
      if (!confirmed) return;

      const reason = window.prompt('Enter override reason for audit trail:', 'Manual gas cross-check and ventilation completed');
      if (!reason || !reason.trim()) {
        setMessage('Override reason is required for DANGEROUS approvals.');
        return;
      }
      overrideReason = reason.trim();
    }

    const approvedAt = new Date().toISOString();
    await alertService.approveEntry(manholeId, {
      approvedBy: sanitizedApprover,
      approvedAt,
      overrideReason
    });

    setChecks((prev) =>
      prev.map((item) =>
        item.id === manholeId
          ? {
              ...item,
              status: 'SAFE',
              aiClassification: 'SAFE',
              operationalStatus: 'SAFE',
              aiRiskScore: Math.max(10, Math.round((item.aiRiskScore || 20) * 0.35)),
              reason: 'Approved by supervisor after manual verification',
              approvedBy: sanitizedApprover,
              approvedAt,
              overrideReason
            }
          : item
      )
    );
    setMessage(`Entry approved for ${manholeId} by ${sanitizedApprover}.`);
  };

  if (loading) return <Loader rows={3} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {message ? (
        <div className="lg:col-span-2 xl:col-span-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      <Card className="lg:col-span-2 xl:col-span-3 p-4">
        <div className="grid gap-2 md:grid-cols-2 md:items-end">
          <div>
            <label htmlFor="approver-name" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Approver Name
            </label>
            <input
              id="approver-name"
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              placeholder="Enter supervisor/operator name"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-500/60"
            />
          </div>
          <p className="text-xs text-slate-400">
            All approvals are logged with approver identity and timestamp. DANGEROUS overrides also require a reason.
          </p>
        </div>
      </Card>

      {checks.map((check) => (
        <Card key={check.id} className="p-4" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">{check.location}</p>
              <h3 className="text-sm font-semibold text-slate-100">{check.id}</h3>
            </div>
            <div className="flex gap-2">
              <Badge value={check.aiClassification || check.status} />
              <Badge value={check.operationalStatus || check.status} />
            </div>
          </div>

          <div className="ai-risk-box mt-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs">
            <p className="ai-risk-title font-semibold">
              AI Pre-Entry Risk: {check.aiClassification || check.status} ({check.aiRiskScore || 0}/100)
            </p>
            <p className="ai-risk-body mt-1">{check.aiReason || check.reason}</p>
            {check.aiFactors ? (
              <p className="ai-risk-meta mt-1 text-[11px]">
                Scan {check.aiFactors.scanRisk} | Historical {check.aiFactors.historical} | Incidents {check.aiFactors.incidentRisk} | Seasonal {check.aiFactors.seasonalRisk}
              </p>
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2 text-xs">
            {Object.entries(check.readings).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-slate-200">
                <p className="text-[10px] text-slate-500">{key}</p>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <p className="mt-3 min-h-10 text-xs text-slate-400">{check.reason || 'All sensors are within safe range.'}</p>

          {check.approvedAt ? (
            <div className="mt-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
              <p>
                Approved by <span className="font-semibold">{check.approvedBy || 'Supervisor'}</span> at {new Date(check.approvedAt).toLocaleString()}
              </p>
              {check.overrideReason ? <p className="mt-1 text-emerald-200/90">Override reason: {check.overrideReason}</p> : null}
            </div>
          ) : null}

          <ChartWrapper title="Depth-Based Gas Readings" subtitle="0m to 6m sensor layers">
            <BarChart
              labels={['0m', '2m', '4m', '6m']}
              values={check.depthReadings}
              label="Composite Risk"
              color={
                (check.aiClassification || check.status) === 'DANGEROUS'
                  ? '#EF4444'
                  : (check.aiClassification || check.status) === 'CAUTION'
                    ? '#F59E0B'
                    : '#10B981'
              }
            />
          </ChartWrapper>

          <button
            type="button"
            onClick={() => approveEntry(check.id, check.status)}
            disabled={check.status === 'SAFE' && !!check.approvedAt}
            className="mt-3 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {check.status === 'SAFE' && check.approvedAt ? 'Already Approved' : 'Approve Entry'}
          </button>
        </Card>
      ))}
    </section>
  );
}
