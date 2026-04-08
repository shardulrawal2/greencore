import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Activity, Thermometer, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock data for mini charts
const efficiencyData = [
  { time: '00:00', value: 85 },
  { time: '04:00', value: 87 },
  { time: '08:00', value: 89 },
  { time: '12:00', value: 91 },
  { time: '16:00', value: 88 },
  { time: '20:00', value: 90 },
];

const carbonData = [
  { time: '00:00', intensity: 200 },
  { time: '04:00', intensity: 180 },
  { time: '08:00', value: 250 },
  { time: '12:00', intensity: 300 },
  { time: '16:00', intensity: 280 },
  { time: '20:00', intensity: 220 },
];

const alerts = [
  { id: 1, message: 'Thermal hotspot detected in Rack A4', severity: 'high', time: '2 min ago' },
  { id: 2, message: 'Water flow anomaly in Rack B2', severity: 'medium', time: '5 min ago' },
  { id: 3, message: 'Network congestion on Link C1-C2', severity: 'low', time: '8 min ago' },
  { id: 4, message: 'Carbon intensity spike detected', severity: 'medium', time: '12 min ago' },
];

export default function Overview() {
  const [efficiencyScore, setEfficiencyScore] = useState(89);
  const [carbonIntensity, setCarbonIntensity] = useState(245);

  useEffect(() => {
    const interval = setInterval(() => {
      setEfficiencyScore(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 1)));
      setCarbonIntensity(prev => Math.max(0, prev + (Math.random() - 0.5) * 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Efficiency Score - Top Left (2x2) */}
      <motion.div
        className="col-span-2 row-span-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6"
        layoutId="efficiency-score"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">System Efficiency</h2>
          <Activity className="w-6 h-6 text-gold" />
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${efficiencyScore}, 100`}
                className="text-gold"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-gold">{Math.round(efficiencyScore)}</div>
                <div className="text-sm text-gray-400">/ 100</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={efficiencyData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FFD700"
                fill="#FFD700"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Carbon Gauge - Top Right (1x2) */}
      <motion.div
        className="row-span-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6"
        layoutId="carbon-gauge"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Carbon Intensity</h3>
          <TrendingUp className="w-5 h-5 text-alert-orange" />
        </div>
        <div className="flex items-center justify-center h-24 mb-4">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-alert-orange">{Math.round(carbonIntensity)}</div>
            <div className="text-sm text-gray-400">gCO₂/kWh</div>
          </div>
        </div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={carbonData}>
              <Line
                type="monotone"
                dataKey="intensity"
                stroke="#FFA500"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Mini Thermal Heatmap */}
      <motion.div
        className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4"
        layoutId="thermal-heatmap"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">Thermal Grid</h4>
          <Thermometer className="w-4 h-4 text-neon-teal" />
        </div>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded"
              style={{
                backgroundColor: `hsl(${240 - (i * 15)}, 70%, 50%)`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Network Preview */}
      <motion.div
        className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4"
        layoutId="network-preview"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">Network Health</h4>
          <Zap className="w-4 h-4 text-gold" />
        </div>
        <div className="flex items-center justify-center h-16">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 border-2 border-gold rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gold rounded-full opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-gold">98%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alert Feed - Bottom (2x1) */}
      <motion.div
        className="col-span-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4"
        layoutId="alert-feed"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Active Alerts</h4>
          <AlertTriangle className="w-4 h-4 text-alert-red" />
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg text-xs",
                alert.severity === 'high' ? 'bg-alert-red/10 border border-alert-red/20' :
                alert.severity === 'medium' ? 'bg-alert-orange/10 border border-alert-orange/20' :
                'bg-gray-500/10 border border-gray-500/20'
              )}
            >
              <span className="text-white">{alert.message}</span>
              <span className="text-gray-400">{alert.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}