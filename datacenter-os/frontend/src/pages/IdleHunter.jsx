import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Server, TrendingDown, Play, Eye, Zap } from 'lucide-react';
import serversDataJson from '../data/servers.json';

export default function IdleHunter() {
  const [mode, setMode] = useState('before');
  const [data, setData] = useState(serversDataJson.before);

  useEffect(() => {
    // Optional slow simulation
    const interval = setInterval(() => {
      // Slight variation for demo
      setData(prev => ({
        ...prev,
        servers: prev.servers.map(server => ({
          ...server,
          utilization: Math.max(0, Math.min(100, server.utilization + (Math.random() - 0.5) * 5))
        }))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleMode = () => {
    setMode(mode === 'before' ? 'after' : 'before');
    setData(mode === 'before' ? serversDataJson.after : serversDataJson.before);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">IdleHunter</h1>
          <p className="text-gray-400">Consolidate idle servers to reduce energy waste</p>
        </div>
        <motion.button
          onClick={toggleMode}
          className="bg-gold text-obsidian font-medium py-2 px-4 rounded-lg hover:bg-gold/90 transition-colors flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mode === 'before' ? <Zap className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{mode === 'before' ? 'Show Optimized' : 'Show Before'}</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <motion.div className="col-span-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Server Grid</h2>
          <div className="grid grid-cols-4 gap-2">
            {data.servers.map((server) => (
              <motion.div
                key={server.id}
                className={cn("aspect-square rounded cursor-pointer", getStatusColor(server.status))}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-400">
            <span>Active: {data.metrics.activeServers}</span>
            <span>Idle: {data.metrics.idleServers}</span>
            <span>Efficiency: {data.metrics.efficiency}%</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Clusters</h3>
            {data.clusters.map((cluster, index) => (
              <div key={index} className="text-sm text-gray-300 mb-2">
                {cluster.type}: {cluster.count} servers ({cluster.location})
              </div>
            ))}
          </motion.div>

          <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Optimization Impact</h3>
            <div className="text-sm text-gray-300">
              {mode === 'after' ? '✓ Servers consolidated - 100% efficiency achieved' : 'Problem: 6 idle servers wasting energy'}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}