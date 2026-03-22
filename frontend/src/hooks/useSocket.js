import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { classifyBiometricHealth } from '../utils/healthClassifier';

const randomDelta = (value, variance = 0.2) => Math.max(0, Number((value + (Math.random() - 0.5) * variance).toFixed(2)));

export const useSocket = ({ enabled = true, onWorkerUpdate, onAlertEvent }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    // This is API-ready: if backend socket exists, this connection can be used directly.
    const socket = io('http://localhost:4000', {
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true
    });

    socketRef.current = socket;

    const intervalId = window.setInterval(() => {
      const selectedWorker = [
        { id: 'RK-1001', name: 'Aarav Singh' },
        { id: 'RK-1002', name: 'Vihaan Rao' },
        { id: 'RK-1003', name: 'Ishaan Malik' },
        { id: 'RK-1004', name: 'Kabir Das' }
      ][Math.floor(Math.random() * 4)];

      const health = {
        hr: Math.round(76 + Math.random() * 72),
        spo2: Math.round(86 + Math.random() * 13),
        temperature: Number((36.2 + Math.random() * 3.4).toFixed(1))
      };
      const immobilitySeconds = Math.round(Math.random() * 45);

      const payload = {
        workerId: selectedWorker.id,
        workerName: selectedWorker.name,
        updatedAt: new Date().toISOString(),
        batteryDelta: Math.random() > 0.7 ? -1 : 0,
        health,
        immobilitySeconds,
        gases: {
          H2S: randomDelta(10 + Math.random() * 20, 2),
          CH4: randomDelta(4 + Math.random() * 8, 1.2),
          CO: randomDelta(20 + Math.random() * 90, 5),
          O2: randomDelta(20 - Math.random() * 4, 0.4),
          NH3: randomDelta(10 + Math.random() * 60, 3)
        }
      };
      onWorkerUpdate?.(payload);

      if (payload.gases.CO > 80 || payload.gases.H2S > 28 || payload.gases.O2 < 17.5) {
        onAlertEvent?.({
          workerId: selectedWorker.id,
          workerName: selectedWorker.name,
          severity: payload.gases.CO > 110 || payload.gases.O2 < 16.8 ? 'CRITICAL' : 'DANGER',
          type: 'REALTIME_SENSOR_BREACH',
          createdAt: payload.updatedAt,
          gases: payload.gases
        });
      }

      const healthStatus = classifyBiometricHealth({
        current: payload.health,
        previous: {
          spo2: payload.health.spo2 + Math.round(Math.random() * 3)
        },
        immobilitySeconds
      });

      if (healthStatus === 'DISTRESSED' || healthStatus === 'CRITICAL') {
        onAlertEvent?.({
          workerId: selectedWorker.id,
          workerName: selectedWorker.name,
          severity: healthStatus === 'CRITICAL' ? 'CRITICAL' : 'DANGER',
          type: 'BIOMETRIC_HEALTH_ANOMALY',
          createdAt: payload.updatedAt,
          gases: payload.gases,
          health: payload.health,
          healthStatus,
          immobilitySeconds,
          emergencySignal: true
        });
      }
    }, 3500);

    return () => {
      window.clearInterval(intervalId);
      socket.disconnect();
    };
  }, [enabled, onAlertEvent, onWorkerUpdate]);

  return { socket: socketRef.current };
};
