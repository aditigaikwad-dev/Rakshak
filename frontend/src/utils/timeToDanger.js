import { GAS_THRESHOLDS } from '../constants/colors';

const etaForGas = (gasName, value, driftPerMinute) => {
  const config = GAS_THRESHOLDS[gasName];
  if (!config) return null;

  const dangerLevel = config.danger;
  if (config.inverse) {
    if (value <= dangerLevel) return 0;
    if (driftPerMinute >= 0) return null;
    return ((value - dangerLevel) / Math.abs(driftPerMinute)) * 60;
  }

  if (value >= dangerLevel) return 0;
  if (driftPerMinute <= 0) return null;
  return ((dangerLevel - value) / driftPerMinute) * 60;
};

export const getTimeToDanger = (worker) => {
  const drifts = worker?.drift || {};
  const gases = worker?.gases || {};
  const etas = Object.keys(gases)
    .map((gasName) => etaForGas(gasName, gases[gasName], drifts[gasName] || 0))
    .filter((value) => typeof value === 'number' && value >= 0);

  if (!etas.length) return null;
  return Math.min(...etas);
};
