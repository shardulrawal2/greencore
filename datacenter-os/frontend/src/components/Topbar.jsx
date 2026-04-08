import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Zap, Droplets, Leaf, AlertTriangle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useMetrics } from '../context/MetricsContext';

const sparklineData = [
  { value: 8 },
  { value: 10 },
  { value: 12 },
  { value: 9 },
  { value: 13 },
  { value: 11 },
  { value: 14 },
];

export default function Topbar() {
  const location = useLocation();
  const { metrics } = useMetrics();
  const [efficiencyScore, setEfficiencyScore] = useState(87);

  const kpiData = [
    {
      label: 'Energy Saved',
      icon: Zap,
      trend: '+2.1%',
      value: `${metrics.energySaved.toFixed(1)} kWh`,
      color: 'text-green-400',
    },
    {
      label: 'Water Saved',
      icon: Droplets,
      trend: '+8.3%',
      value: `${metrics.waterSaved.toFixed(0)} L`,
      color: 'text-sky-400',
    },
    {
      label: 'CO₂ Avoided',
      icon: Leaf,
      trend: '+15.7%',
      value: `${metrics.co2Avoided.toFixed(1)} t`,
      color: 'text-green-400',
    },
    {
      label: 'Hotspots',
      icon: AlertTriangle,
      trend: metrics.hotspots ? `-${metrics.hotspots * 10}%` : '-100%',
      value: metrics.hotspots,
      color: metrics.hotspots ? 'text-red-400' : 'text-green-400',
    },
  ];

  // Simulate efficiency score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEfficiencyScore(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/overview' || path === '/') return 'Platform > Overview';
    if (path === '/thermal') return 'Platform > ThermalTrace';
    if (path === '/idle') return 'Platform > IdleHunter';
    if (path === '/water') return 'Platform > WaterWatch';
    if (path === '/carbon') return 'Platform > CarbonClock';
    if (path === '/network') return 'Platform > LightSpeed';
    if (path === '/about') return 'Platform > About';
    return 'Platform';
  };

  return (
    <div className="fixed top-0 left-64 right-0 z-30 h-16 bg-card-bg/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-400">
        {getBreadcrumbs()}
      </div>

      {/* Efficiency Score */}
      <div className="flex-1 flex justify-center">
        <div className="relative">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${efficiencyScore}, 100`}
              className="text-gold"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-gold">{Math.round(efficiencyScore)}</div>
              <div className="text-xs text-gray-400">Efficiency</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="flex space-x-4">
        {kpiData.map((kpi, index) => (
          <div key={kpi.label} className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-3 min-w-[120px]">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className="w-4 h-4 text-gray-400" />
              <span className={cn("text-xs font-medium", kpi.color)}>
                {kpi.trend}
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-xs text-gray-400">{kpi.label}</div>
            <div className="mt-2 h-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FFD700"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}