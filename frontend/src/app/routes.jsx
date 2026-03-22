import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import { Loader } from '../components/ui/Loader';

const LiveMonitoring = lazy(() => import('../screens/LiveMonitoring'));
const PreEntryGate = lazy(() => import('../screens/PreEntryGate'));
const AlertHistory = lazy(() => import('../screens/AlertHistory'));
const RiskMap = lazy(() => import('../screens/RiskMap'));
const WorkerProfiles = lazy(() => import('../screens/WorkerProfiles'));
const DailyReport = lazy(() => import('../screens/DailyReport'));
const Settings = lazy(() => import('../screens/Settings'));
const NotFound = lazy(() => import('../screens/NotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader rows={3} />}>
      <Routes>
        <Route path="/" element={<LiveMonitoring />} />
        <Route path={APP_ROUTES.live} element={<LiveMonitoring />} />
        <Route path={APP_ROUTES.gate} element={<PreEntryGate />} />
        <Route path={APP_ROUTES.alerts} element={<AlertHistory />} />
        <Route path={APP_ROUTES.map} element={<RiskMap />} />
        <Route path={APP_ROUTES.workers} element={<WorkerProfiles />} />
        <Route path={APP_ROUTES.report} element={<DailyReport />} />
        <Route path={APP_ROUTES.settings} element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
