import { useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRoutes from './routes';
import Sidebar from '../components/ui/Sidebar';
import TopBar from '../components/ui/TopBar';
import AppErrorBoundary from '../components/ui/AppErrorBoundary';
import { AppProvider } from '../context/AppContext';
import { APP_ROUTES } from '../constants/routes';
import { useAlerts } from '../hooks/useAlerts';

const resolveTheme = (themePreference) => {
  if (themePreference === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return themePreference;
};

const applyThemePreference = (themePreference) => {
  const resolved = resolveTheme(themePreference);
  document.documentElement.dataset.theme = resolved;
};

const readSettings = () => {
  try {
    const raw = localStorage.getItem('rakshak.settings');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function Layout() {
  const { openCount } = useAlerts();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = readSettings();
    const preference = saved?.theme || 'light';
    applyThemePreference(preference);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemThemeChange = () => {
      const latest = readSettings();
      if ((latest?.theme || 'light') === 'auto') {
        applyThemePreference('auto');
      }
    };

    media.addEventListener('change', onSystemThemeChange);
    return () => media.removeEventListener('change', onSystemThemeChange);
  }, []);

  return (
    <div className="min-h-screen bg-app-gradient text-slate-100">
      <Sidebar />
      <main className="px-3 pb-5 pt-4 md:px-5 xl:ml-72">
        <TopBar
          openAlerts={openCount}
          systemStatus="ACTIVE - MONITORING"
          onAlertsClick={() => navigate(APP_ROUTES.alerts)}
          onStatusClick={() => navigate(APP_ROUTES.live)}
          onProfileClick={() => navigate(APP_ROUTES.workers)}
        />
        <div className="animate-fade-in">
          <AppRoutes />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <Layout />
        </AppProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
