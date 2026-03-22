import { GAS_THRESHOLDS } from '../constants/colors';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const gasRiskScore = (readings) => {
  let score = 0;

  Object.entries(readings).forEach(([gas, value]) => {
    const threshold = GAS_THRESHOLDS[gas];
    if (!threshold) return;

    if (threshold.inverse) {
      if (value <= threshold.critical) score += 30;
      else if (value <= threshold.danger) score += 22;
      else if (value <= threshold.warning) score += 14;
      else score += 4;
      return;
    }

    if (value >= threshold.critical) score += 30;
    else if (value >= threshold.danger) score += 22;
    else if (value >= threshold.warning) score += 14;
    else score += 4;
  });

  return Math.round(score / 5);
};

export const classifyPreEntryRisk = ({ readings, historicalRiskScore = 0.2, incidentCount = 0, seasonalFactor = 1 }) => {
  const scanRisk = gasRiskScore(readings);
  const historical = clamp(Math.round(historicalRiskScore * 100), 0, 100);
  const incidentRisk = clamp(incidentCount * 7, 0, 35);
  const seasonalRisk = clamp(Math.round((seasonalFactor - 1) * 20), -10, 20);

  const score = clamp(Math.round(scanRisk * 0.52 + historical * 0.28 + incidentRisk + seasonalRisk), 0, 100);

  let aiClassification = 'SAFE';
  if (score >= 70) aiClassification = 'DANGEROUS';
  else if (score >= 40) aiClassification = 'CAUTION';

  const reason =
    aiClassification === 'DANGEROUS'
      ? 'Combined gas scan and historical incident profile indicate high collapse/toxic risk.'
      : aiClassification === 'CAUTION'
        ? 'Moderate anomaly detected. Supervisor clearance and ventilation check recommended.'
        : 'Pre-entry AI model indicates stable conditions for controlled entry.';

  return {
    aiClassification,
    score,
    factors: {
      scanRisk,
      historical,
      incidentRisk,
      seasonalRisk
    },
    reason
  };
};
