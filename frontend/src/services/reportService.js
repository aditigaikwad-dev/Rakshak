import { alerts, reportSummary } from './mockData';

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportService = {
  async getDailyReport() {
    await wait();
    return {
      summary: reportSummary,
      alertsTable: alerts
    };
  }
};
