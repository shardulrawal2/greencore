import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Clock, Leaf, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import carbonDataJson from '../data/carbon.json';

export default function CarbonClock() {
  const [data, setData] = useState(carbonDataJson);

  useEffect(() => {
    // Slow simulation for demo stability
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        currentIntensity: Math.max(150, Math.min(350, prev.currentIntensity + (Math.random() - 0.5) * 20))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const deferJob = (jobId) => {
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.map(job =>
        job.id === jobId ? { ...job, status: job.status === 'deferred' ? 'run_now' : 'deferred' } : job
      ),
      totalCO2Saved: prev.totalCO2Saved + (prev.jobs.find(j => j.id === jobId)?.co2Saved || 0)
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">CarbonClock</h1>
        <p className="text-gray-400">Schedule workloads during low-carbon periods</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <motion.div className="col-span-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Carbon Intensity Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.timeline}>
              <XAxis dataKey="time" />
              <YAxis />
              <Line type="monotone" dataKey="intensity" stroke="#FFD700" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="space-y-4">
          <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Current Intensity</h3>
            <div className="text-3xl font-mono font-bold text-gold">{data.currentIntensity}</div>
            <div className="text-sm text-gray-400">gCO₂/kWh</div>
          </motion.div>

          <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Total CO₂ Saved</h3>
            <div className="text-2xl font-mono font-bold text-green-400">{data.totalCO2Saved} kg</div>
          </motion.div>
        </div>
      </div>

      <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Job Queue</h2>
        <div className="space-y-3">
          {data.jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 bg-obsidian/50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-white">{job.name}</div>
                <div className="text-xs text-gray-400">CO₂ Saved: {job.co2Saved} kg</div>
              </div>
              <motion.button
                onClick={() => deferJob(job.id)}
                className={cn(
                  "px-3 py-1 rounded text-sm font-medium",
                  job.status === 'deferred'
                    ? "bg-green-600 text-white"
                    : "bg-gold text-obsidian"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {job.status === 'deferred' ? 'Deferred' : 'Defer'}
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
