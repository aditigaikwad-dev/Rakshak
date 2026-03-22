import { useMemo, useState } from 'react';
import { Clock4 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { EmptyState, ErrorState, Loader } from '../components/ui/Loader';
import { useAlerts } from '../hooks/useAlerts';
import { formatDateTime } from '../utils/formatters';

export default function AlertHistory() {
	const { alerts, loading, error, fetchAlerts, acknowledge } = useAlerts();
	const [severity, setSeverity] = useState('ALL');
	const [status, setStatus] = useState('ALL');
	const [message, setMessage] = useState('');

	const handleAcknowledge = async (alertId) => {
		await acknowledge(alertId);
		setMessage(`Alert ${alertId} acknowledged.`);
	};

	const filtered = useMemo(
		() =>
			alerts.filter((alert) => {
				if (severity !== 'ALL' && alert.severity !== severity) return false;
				if (status !== 'ALL' && alert.status !== status) return false;
				return true;
			}),
		[alerts, severity, status]
	);

	if (loading) return <Loader rows={4} />;
	if (error) return <ErrorState message={error} onRetry={fetchAlerts} />;

	return (
		<section>
			{message ? (
				<div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
					{message}
				</div>
			) : null}

			<div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
				<select
					value={severity}
					onChange={(e) => setSeverity(e.target.value)}
					className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200"
				>
					<option value="ALL">All Severity</option>
					<option value="WARNING">WARNING</option>
					<option value="DANGER">DANGER</option>
					<option value="CRITICAL">CRITICAL</option>
				</select>
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200"
				>
					<option value="ALL">All Status</option>
					<option value="OPEN">OPEN</option>
					<option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
					<option value="RESOLVED">RESOLVED</option>
				</select>
			</div>

			{filtered.length === 0 ? (
				<EmptyState title="No alerts found" subtitle="Change filters to inspect past events." />
			) : (
				<div className="space-y-3">
					{filtered.map((alert) => (
						<Card key={alert.id} className="p-4" hover>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<p className="text-sm font-semibold text-slate-100">{alert.type.replaceAll('_', ' ')}</p>
									<p className="mt-1 text-xs text-slate-400">Worker: {alert.workerName}</p>
								</div>
								<div className="flex items-center gap-2">
									<Badge value={alert.severity} />
									<Badge value={alert.status} />
								</div>
							</div>

							<div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
								{Object.entries(alert.gases).map(([gas, value]) => (
									<span key={gas} className="rounded border border-slate-700 bg-slate-800 px-2 py-1">
										{gas}: {value}
									</span>
								))}
							</div>

							<div className="mt-3 flex items-center justify-between">
								<span className="inline-flex items-center gap-1 text-xs text-slate-400">
									<Clock4 size={13} /> {formatDateTime(alert.createdAt)}
								</span>

								<button
									type="button"
									disabled={alert.status !== 'OPEN'}
									onClick={() => handleAcknowledge(alert.id)}
									className="ack-btn rounded-lg px-3 py-1.5 text-xs font-semibold"
								>
									Acknowledge
								</button>
							</div>
						</Card>
					))}
				</div>
			)}
		</section>
	);
}
