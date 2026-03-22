const now = Date.now();

export const wards = [
  { id: 'W1', name: 'Ward 1 - Sadar Bazar', center: [17.6772, 75.9118], risk: 0.25 },
  { id: 'W2', name: 'Ward 2 - Hotgi Road', center: [17.6468, 75.9304], risk: 0.52 },
  { id: 'W3', name: 'Ward 3 - MIDC Zone', center: [17.6405, 75.8762], risk: 0.81 },
  { id: 'W4', name: 'Ward 4 - Vijapur Naka', center: [17.6644, 75.8908], risk: 0.38 }
];

export const workers = [
  {
    id: 'RK-1001',
    name: 'Aarav Singh',
    ward: 'W1',
    jacketId: 'J-11',
    battery: 86,
    updatedAt: new Date(now - 40 * 1000).toISOString(),
    location: [17.6764, 75.9126],
    severity: 'NORMAL',
    healthStatus: 'NORMAL',
    emergencySignal: false,
    immobilitySeconds: 0,
    gases: { H2S: 6, CH4: 2.1, CO: 15, O2: 20.2, NH3: 10 },
    health: { hr: 84, spo2: 98, temperature: 36.7 },
    emergencyContact: { name: 'Pooja Singh', phone: '+91 90000 10001' },
    drift: { H2S: 0.05, CH4: 0.03, CO: 0.1, O2: -0.02, NH3: 0.04 }
  },
  {
    id: 'RK-1002',
    name: 'Vihaan Rao',
    ward: 'W2',
    jacketId: 'J-17',
    battery: 57,
    updatedAt: new Date(now - 35 * 1000).toISOString(),
    location: [17.6479, 75.9292],
    severity: 'WARNING',
    healthStatus: 'STRESSED',
    emergencySignal: false,
    immobilitySeconds: 8,
    gases: { H2S: 11, CH4: 5.6, CO: 32, O2: 19.4, NH3: 22 },
    health: { hr: 102, spo2: 95, temperature: 37.6 },
    emergencyContact: { name: 'Nisha Rao', phone: '+91 90000 10002' },
    drift: { H2S: 0.14, CH4: 0.08, CO: 0.2, O2: -0.03, NH3: 0.1 }
  },
  {
    id: 'RK-1003',
    name: 'Ishaan Malik',
    ward: 'W3',
    jacketId: 'J-24',
    battery: 39,
    updatedAt: new Date(now - 15 * 1000).toISOString(),
    location: [17.6418, 75.8773],
    severity: 'DANGER',
    healthStatus: 'DISTRESSED',
    emergencySignal: true,
    immobilitySeconds: 24,
    gases: { H2S: 23, CH4: 12.3, CO: 74, O2: 18.2, NH3: 55 },
    health: { hr: 126, spo2: 91, temperature: 38.4 },
    emergencyContact: { name: 'Arjun Malik', phone: '+91 90000 10003' },
    drift: { H2S: 0.23, CH4: 0.15, CO: 0.45, O2: -0.08, NH3: 0.22 }
  },
  {
    id: 'RK-1004',
    name: 'Kabir Das',
    ward: 'W3',
    jacketId: 'J-26',
    battery: 22,
    updatedAt: new Date(now - 12 * 1000).toISOString(),
    location: [17.6399, 75.8749],
    severity: 'CRITICAL',
    healthStatus: 'CRITICAL',
    emergencySignal: true,
    immobilitySeconds: 36,
    gases: { H2S: 35, CH4: 16, CO: 128, O2: 16.1, NH3: 96 },
    health: { hr: 148, spo2: 86, temperature: 39.3 },
    emergencyContact: { name: 'Aditi Das', phone: '+91 90000 10004' },
    drift: { H2S: 0.31, CH4: 0.21, CO: 0.62, O2: -0.12, NH3: 0.29 }
  }
];

export const alerts = [
  {
    id: 'AL-001',
    workerId: 'RK-1004',
    workerName: 'Kabir Das',
    severity: 'CRITICAL',
    status: 'OPEN',
    type: 'MULTI_GAS_BREACH',
    gases: { H2S: 35, CH4: 16, CO: 128, O2: 16.1, NH3: 96 },
    createdAt: new Date(now - 12 * 60 * 1000).toISOString()
  },
  {
    id: 'AL-002',
    workerId: 'RK-1003',
    workerName: 'Ishaan Malik',
    severity: 'DANGER',
    status: 'ACKNOWLEDGED',
    type: 'HIGH_CO',
    gases: { H2S: 21, CH4: 10.2, CO: 76, O2: 18.4, NH3: 52 },
    createdAt: new Date(now - 32 * 60 * 1000).toISOString()
  },
  {
    id: 'AL-003',
    workerId: 'RK-1002',
    workerName: 'Vihaan Rao',
    severity: 'WARNING',
    status: 'RESOLVED',
    type: 'LOW_OXYGEN',
    gases: { H2S: 10, CH4: 5.2, CO: 34, O2: 19.3, NH3: 21 },
    createdAt: new Date(now - 70 * 60 * 1000).toISOString()
  }
];

export const gateChecks = [
  {
    id: 'MH-01',
    location: 'Sector A-12',
    status: 'SAFE',
    reason: '',
    approvedBy: 'Shift Supervisor - Anjali Patil',
    approvedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    overrideReason: '',
    historicalRiskScore: 0.22,
    incidentCount: 1,
    seasonalFactor: 0.96,
    readings: { H2S: 5, CH4: 1.8, CO: 12, O2: 20.5, NH3: 7 },
    depthReadings: [9, 12, 10, 8]
  },
  {
    id: 'MH-02',
    location: 'Sector B-04',
    status: 'UNSAFE',
    reason: 'CO exceeded safety threshold',
    historicalRiskScore: 0.74,
    incidentCount: 5,
    seasonalFactor: 1.18,
    readings: { H2S: 18, CH4: 7.5, CO: 88, O2: 18.6, NH3: 38 },
    depthReadings: [20, 42, 88, 76]
  },
  {
    id: 'MH-03',
    location: 'Sector C-22',
    status: 'PENDING',
    reason: 'Sensor calibration in progress',
    historicalRiskScore: 0.41,
    incidentCount: 2,
    seasonalFactor: 1.05,
    readings: { H2S: 0, CH4: 0, CO: 0, O2: 0, NH3: 0 },
    depthReadings: [0, 0, 0, 0]
  }
];

export const hourlyAlerts = [2, 1, 0, 0, 1, 2, 3, 4, 4, 3, 2, 2, 1, 1, 2, 3, 4, 5, 4, 4, 3, 2, 2, 1];

export const reportSummary = {
  activeWorkers: 18,
  highRiskZones: 3,
  totalAlerts: 19,
  resolvedRate: 0.84,
  criticalAlerts: 2
};

export const workerHealthTrend = {
  'RK-1001': {
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00'],
    hr: [78, 82, 84, 86, 83],
    spo2: [99, 98, 98, 97, 98],
    temperature: [36.5, 36.6, 36.7, 36.8, 36.7]
  },
  'RK-1002': {
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00'],
    hr: [90, 94, 99, 103, 102],
    spo2: [97, 96, 95, 95, 95],
    temperature: [37.1, 37.3, 37.4, 37.6, 37.6]
  },
  'RK-1003': {
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00'],
    hr: [108, 112, 118, 124, 126],
    spo2: [95, 94, 93, 92, 91],
    temperature: [37.4, 37.6, 38.0, 38.3, 38.4]
  },
  'RK-1004': {
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00'],
    hr: [116, 122, 133, 142, 148],
    spo2: [93, 92, 90, 88, 86],
    temperature: [37.8, 38.2, 38.7, 39.0, 39.3]
  }
};
