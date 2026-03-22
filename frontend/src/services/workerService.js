import { workerHealthTrend, workers } from './mockData';

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const workerService = {
  async getWorkers() {
    await wait();
    return JSON.parse(JSON.stringify(workers));
  },

  async getWorkerById(workerId) {
    await wait(250);
    return workers.find((worker) => worker.id === workerId) || null;
  },

  async getWorkerHealthTrend(workerId) {
    await wait(300);
    return workerHealthTrend[workerId] || { labels: [], hr: [], spo2: [], temperature: [] };
  },

  async assignJacket(workerId, jacketId) {
    await wait(300);
    return { workerId, jacketId, success: true };
  },

  async updateEmergencyContact(workerId, emergencyContact) {
    await wait(300);
    return { workerId, emergencyContact, success: true };
  }
};
