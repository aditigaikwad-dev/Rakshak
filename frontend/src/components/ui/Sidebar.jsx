import {
  Activity,
  FileBarChart2,
  Map,
  Settings,
  ShieldCheck,
  Siren,
  Users
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/routes';

const iconMap = {
  Activity,
  ShieldCheck,
  Siren,
  Map,
  Users,
  FileBarChart2,
  Settings
};

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[var(--surface-border)] bg-[var(--surface-2)] p-4 backdrop-blur xl:block">
      <div className="mb-8 rounded-2xl border border-[var(--surface-border)] bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] p-4 [box-shadow:var(--surface-shadow)]">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Industrial Safety</p>
        <h1 className="mt-2 text-2xl font-black tracking-wide text-slate-100">RAKSHAK</h1>
      </div>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-[inset_0_0_0_1px_rgba(148,163,184,.25)]'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                }`
              }
            >
              <Icon size={18} className="opacity-80 transition group-hover:opacity-100" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
