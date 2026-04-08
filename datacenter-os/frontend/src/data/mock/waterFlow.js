import { createMockGenerator } from './generator';

const IT_LOAD_KW = 500;
const INDUSTRY_BKM = {
  google: 1.1,
  industry: 1.8,
  poor: 3.0
};

// Start intentionally high roughly total ~1750-1900 L/h => ~3.5 WUE
const initUnits = Array.from({ length: 5 }, (_, i) => ({
  id: `cu-rack${i+1}`,
  flow_rate_lph: 350 + Math.random() * 50
}));

function applyFlowDrift(units) {
  // Check if there is an active spike/anomaly
  const hasAnomaly = Math.random() < 0.05; // 5% chance 
  const anomalyIndex = hasAnomaly ? Math.floor(Math.random() * 5) : -1;

  return units.map((u, i) => {
    let baseDrift = (Math.random() - 0.5) * 20; // normal drift
    let newValue = u.flow_rate_lph + baseDrift;
    
    if (i === anomalyIndex) {
      // Create a massive z-score deviation
      newValue += 800 + Math.random() * 400; 
    } else {
      // Regress anomalies back to normal slowly
      if (newValue > 600) {
        newValue -= (newValue - 400) * 0.2;
      }
    }
    return { ...u, flow_rate_lph: Math.max(100, newValue) };
  });
}

function calculateState(units) {
  const totalFlow = units.reduce((acc, u) => acc + u.flow_rate_lph, 0);
  const wue = totalFlow / IT_LOAD_KW;
  
  // Basic z-score calculation mock (comparing to a rolling mean of ~400 per unit)
  const anomalies = units.filter(u => ((u.flow_rate_lph - 400) / 50) > 2.5);

  return {
    units,
    totalFlow,
    itLoad: IT_LOAD_KW,
    wue,
    anomalies: anomalies.map(a => ({ rack: a.id, issue: "Abnormal flow rate", val: a.flow_rate_lph })),
    benchmarks: INDUSTRY_BKM,
    is_live: false
  };
}

const waterLogic = createMockGenerator(
  calculateState(initUnits),
  (state) => calculateState(applyFlowDrift(state.units))
);

export const getSnapshot = () => waterLogic.getSnapshot();
export const subscribe = (callback, intervalMs = 5000) => waterLogic.subscribe(callback, intervalMs);
