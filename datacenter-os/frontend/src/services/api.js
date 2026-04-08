import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';
const extractData = (response) => response.data;

export const api = {
  // ThermalTrace
  getThermalSnapshot: () => axios.get(`${API_BASE}/thermaltrace/snapshot`).then(extractData),
  predictThermal: (snapshots) => axios.post(`${API_BASE}/thermaltrace/predict`, { snapshots }).then(extractData),

  // IdleHunter
  getServerCluster: () => axios.get(`${API_BASE}/idlehunter/servers`).then(extractData),
  consolidateIdle: () => axios.post(`${API_BASE}/idlehunter/consolidate`).then(extractData),

  // WaterWatch
  getWaterFlows: () => axios.get(`${API_BASE}/waterwatch/flows`).then(extractData),
  getWaterAnomalies: () => axios.get(`${API_BASE}/waterwatch/anomaly`).then(extractData),

  // CarbonClock
  getCarbonIntensity: () => axios.get(`${API_BASE}/carbonclock/intensity`).then(extractData),
  getJobQueue: () => axios.get(`${API_BASE}/carbonclock/jobs`).then(extractData),
  deferJob: (jobId, hours) => axios.post(`${API_BASE}/carbonclock/jobs/${jobId}/defer`, { hours }).then(extractData),
  runJob: (jobId) => axios.post(`${API_BASE}/carbonclock/jobs/${jobId}/run`).then(extractData),

  // LightSpeed
  getNetworkTraffic: () => axios.get(`${API_BASE}/lightspeed/network`).then(extractData),
  optimizeNetwork: () => axios.post(`${API_BASE}/lightspeed/optimize`).then(extractData),

  // Status
  getStatus: () => axios.get(`${API_BASE}/status`).then(extractData),
};