import { useEffect, useState } from 'react';
import { Bell, ShieldAlert, UserCircle2 } from 'lucide-react';
import Badge from './Badge';

export default function TopBar({
	openAlerts = 0,
	systemStatus = 'ACTIVE',
	onAlertsClick,
	onStatusClick,
	onProfileClick
}) {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const timer = window.setInterval(() => setNow(new Date()), 1000);
		return () => window.clearInterval(timer);
	}, []);

	return (
		<header className="sticky top-0 z-20 mb-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] px-4 py-3 backdrop-blur md:px-5 [box-shadow:var(--surface-shadow)]">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<ShieldAlert className="text-emerald-400" size={20} />
					<div>
						<p className="text-xs uppercase tracking-[0.2em] text-slate-500">System Status</p>
						<p className="text-sm font-semibold text-slate-100">{systemStatus}</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onAlertsClick}
						className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 transition hover:border-amber-400/40 hover:bg-slate-800"
					>
						<Bell size={15} />
						{openAlerts} open alerts
					</button>
					<div className="hidden rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 md:block">
						{now.toLocaleTimeString()}
					</div>
					<button
						type="button"
						onClick={onStatusClick}
						className="transition hover:scale-[1.02]"
						aria-label="Open system status"
					>
						<Badge value={openAlerts > 0 ? 'WARNING' : 'SAFE'} />
					</button>
					<button
						type="button"
						onClick={onProfileClick}
						className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-emerald-400/40 hover:bg-slate-800"
					>
						<UserCircle2 size={16} />
						Control Room
					</button>
				</div>
			</div>
		</header>
	);
}
