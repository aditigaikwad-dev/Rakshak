import { useCallback, useEffect, useMemo, useState } from 'react';
import { biometricToSeverity, classifyBiometricHealth } from '../utils/healthClassifier';
import { workerService } from '../services/workerService';

const mergeWithLivePayload = (worker, payload) => {
  if (worker.id !== payload.workerId) return worker;

  const nextHealth = {
    ...worker.health,
    ...(payload.health || {})
  };

  const healthStatus = classifyBiometricHealth({
    current: nextHealth,
    previous: worker.health,
    immobilitySeconds: payload.immobilitySeconds || 0
  });

  const gasSeverity =
    payload.gases.CO > 110 || payload.gases.H2S > 28 || payload.gases.O2 < 16.8
      ? 'CRITICAL'
      : payload.gases.CO > 70 || payload.gases.H2S > 20 || payload.gases.O2 < 18
        ? 'DANGER'
        : payload.gases.CO > 35 || payload.gases.H2S > 10 || payload.gases.O2 < 19.5
          ? 'WARNING'
          : 'NORMAL';

  const healthSeverity = biometricToSeverity(healthStatus);
  const maxSeverity =
    gasSeverity === 'CRITICAL' || healthSeverity === 'CRITICAL'
      ? 'CRITICAL'
      : gasSeverity === 'DANGER' || healthSeverity === 'DANGER'
        ? 'DANGER'
        : gasSeverity === 'WARNING' || healthSeverity === 'WARNING'
          ? 'WARNING'
          : 'NORMAL';

  return {
    ...worker,
    updatedAt: payload.updatedAt,
    battery: Math.max(0, worker.battery + (payload.batteryDelta || 0)),
    health: nextHealth,
    healthStatus,
    immobilitySeconds: payload.immobilitySeconds || 0,
    emergencySignal: healthStatus === 'DISTRESSED' || healthStatus === 'CRITICAL',
    gases: {
      ...worker.gases,
      ...payload.gases
    },
    severity: maxSeverity
  };
};

export const useWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await workerService.getWorkers();
      setWorkers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch workers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const bySeverity = useMemo(() => {
    return workers.reduce(
      (acc, worker) => {
        acc[worker.severity] = (acc[worker.severity] || 0) + 1;
        return acc;
      },
      { NORMAL: 0, WARNING: 0, DANGER: 0, CRITICAL: 0 }
    );
  }, [workers]);

  const applyRealtimeUpdate = useCallback((payload) => {
    setWorkers((prev) => prev.map((worker) => mergeWithLivePayload(worker, payload)));
  }, []);

  return {
    workers,
    loading,
    error,
    bySeverity,
    fetchWorkers,
    applyRealtimeUpdate,
    setWorkers
  };
};
