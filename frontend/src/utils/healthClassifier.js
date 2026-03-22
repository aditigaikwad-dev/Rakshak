export const classifyBiometricHealth = ({ current, previous, immobilitySeconds = 0 }) => {
  const hr = current?.hr ?? 0;
  const spo2 = current?.spo2 ?? 100;
  const temperature = current?.temperature ?? 36.5;

  const spo2Drop = previous?.spo2 ? previous.spo2 - spo2 : 0;
  const collapsePattern = hr >= 130 && spo2Drop >= 2 && spo2 <= 90 && immobilitySeconds >= 30;

  if (collapsePattern || hr >= 145 || spo2 <= 86 || temperature >= 39.2) {
    return 'CRITICAL';
  }

  if (hr >= 125 || spo2 <= 91 || temperature >= 38.5 || immobilitySeconds >= 25) {
    return 'DISTRESSED';
  }

  if (hr >= 108 || spo2 <= 95 || temperature >= 37.7) {
    return 'STRESSED';
  }

  return 'NORMAL';
};

export const biometricToSeverity = (healthStatus) => {
  if (healthStatus === 'CRITICAL') return 'CRITICAL';
  if (healthStatus === 'DISTRESSED') return 'DANGER';
  if (healthStatus === 'STRESSED') return 'WARNING';
  return 'NORMAL';
};
