import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Droplets, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import waterDataJson from '../data/water.json';

export default function WaterWatch() {
  const [data, setData] = useState(waterDataJson);

  useEffect(() => {
    // Optional slow simulation
    const interval = setInterval(() => {
      // Slight variation for demo
      setData(prev => ({
        ...prev,
        racks: prev.racks.map(rack => ({
          ...rack,
          usage: Math.max(100, rack.usage + (Math.random() - 0.5) * 20)
        }))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">WaterWatch</h1>
        <p className="text-gray-400">Monitor water usage and detect cooling inefficiencies</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <motion.div className="col-span-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Rack Water Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.racks}>
              <XAxis dataKey="id" />
              <YAxis />
              <Bar dataKey="usage" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="space-y-4">
          <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Anomalies</h3>
            {data.anomalies.map((anomaly, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">{anomaly.rack}: {anomaly.issue}</span>
              </div>
            ))}
          </motion.div>

          <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4">
            <h3 className="text-lg font-semibold text-white mb-2">WUE Comparison</h3>
            <div className="text-sm text-gray-300">
              Your Average: {data.yourAverage} L/kWh<br/>
              Industry: {data.industryAverage} L/kWh<br/>
              {data.yourAverage < data.industryAverage ? '✓ Better than industry average' : '⚠ Above industry average'}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Usage Timeline</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.timeline}>
            <XAxis dataKey="time" />
            <YAxis />
            <Line type="monotone" dataKey="usage" stroke="#FFD700" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}