import { alerts, gateChecks, hourlyAlerts } from './mockData';
import { classifyPreEntryRisk } from '../utils/preEntryRiskClassifier';

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export const alertService = {
  async getAlerts() {
    await wait();
    return JSON.parse(JSON.stringify(alerts));
  },

  async acknowledgeAlert(alertId) {
    await wait(250);
    return { alertId, status: 'ACKNOWLEDGED', success: true };
  },

  async getGateChecks() {
    await wait(350);
    return gateChecks.map((check) => {
      const ai = classifyPreEntryRisk({
        readings: check.readings,
        historicalRiskScore: check.historicalRiskScore,
        incidentCount: check.incidentCount,
        seasonalFactor: check.seasonalFactor
      });

      return {
        ...JSON.parse(JSON.stringify(check)),
        operationalStatus: check.status,
        status: ai.aiClassification,
        aiClassification: ai.aiClassification,
        aiRiskScore: ai.score,
        aiReason: ai.reason,
        aiFactors: ai.factors
      };
    });
  },

  async approveEntry(manholeId, approval = {}) {
    await wait(250);
    return {
      manholeId,
      approved: true,
      approvedBy: approval.approvedBy || 'Control Room Supervisor',
      approvedAt: approval.approvedAt || new Date().toISOString(),
      overrideReason: approval.overrideReason || ''
    };
  },

  async getHourlyAlertSeries() {
    await wait(250);
    return hourlyAlerts;
  }
};
