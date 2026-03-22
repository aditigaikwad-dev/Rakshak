export const APP_ROUTES = {
  live: '/live',
  gate: '/gate',
  alerts: '/alerts',
  map: '/map',
  workers: '/workers',
  report: '/report',
  settings: '/settings'
};

export const NAV_ITEMS = [
  { key: 'live', label: 'Live Monitoring', path: APP_ROUTES.live, icon: 'Activity' },
  { key: 'gate', label: 'Pre-Entry Gate', path: APP_ROUTES.gate, icon: 'ShieldCheck' },
  { key: 'alerts', label: 'Alert History', path: APP_ROUTES.alerts, icon: 'Siren' },
  { key: 'map', label: 'Risk Map', path: APP_ROUTES.map, icon: 'Map' },
  { key: 'workers', label: 'Workers', path: APP_ROUTES.workers, icon: 'Users' },
  { key: 'report', label: 'Daily Report', path: APP_ROUTES.report, icon: 'FileBarChart2' },
  { key: 'settings', label: 'Settings', path: APP_ROUTES.settings, icon: 'Settings' }
];
