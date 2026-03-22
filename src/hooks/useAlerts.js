import { useCallback, useEffect, useMemo, useState } from 'react';
import { alertService } from '../services/alertService';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const addRealtimeAlert = useCallback((payload) => {
    const nextAlert = {
      id: `AL-RT-${Date.now()}`,
      workerId: payload.workerId,
      workerName: payload.workerName || payload.workerId,
      severity: payload.severity,
      status: 'OPEN',
      type: payload.type,
      gases: payload.gases,
      createdAt: payload.createdAt
    };
    setAlerts((prev) => [nextAlert, ...prev]);
  }, []);

  const acknowledge = useCallback(async (alertId) => {
    await alertService.acknowledgeAlert(alertId);
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, status: 'ACKNOWLEDGED' } : alert))
    );
  }, []);

  const openCount = useMemo(() => alerts.filter((alert) => alert.status === 'OPEN').length, [alerts]);

  return {
    alerts,
    loading,
    error,
    openCount,
    fetchAlerts,
    acknowledge,
    addRealtimeAlert
  };
};
