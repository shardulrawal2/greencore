import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Thermometer, Zap, AlertTriangle, Eye, TrendingUp } from 'lucide-react';
import thermalDataJson from '../data/thermal.json';

export default function ThermalTrace() {
  const [mode, setMode] = useState('current');
  const [data, setData] = useState(thermalDataJson.current);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    // Optional slow simulation
    const interval = setInterval(() => {
      // Slight variation for demo
      setData(prev => ({
        ...prev,
        grid: prev.grid.map(row => row.map(temp => Math.max(0, temp + (Math.random() - 0.5) * 2)))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleMode = () => {
    setMode(mode === 'current' ? 'predicted' : 'current');
    setData(mode === 'current' ? thermalDataJson.predicted : thermalDataJson.current);
  };

  const getColor = (temp) => {
    if (temp > 70) return 'bg-red-500';
    if (temp > 50) return 'bg-orange-500';
    if (temp > 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ThermalTrace</h1>
          <p className="text-gray-400">Predict and prevent thermal hotspots in your datacenter</p>
        </div>
        <motion.button
          onClick={toggleMode}
          className="bg-gold text-obsidian font-medium py-2 px-4 rounded-lg hover:bg-gold/90 transition-colors flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mode === 'current' ? <TrendingUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{mode === 'current' ? 'Show Prediction' : 'Show Current'}</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <motion.div className="col-span-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Thermal Heatmap</h2>
          <div className="grid grid-cols-8 gap-1">
            {data.grid.flat().map((temp, index) => (
              <motion.div
                key={index}
                className={cn("w-8 h-8 rounded cursor-pointer", getColor(temp))}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedCell({ temp, x: Math.floor(index / 8), y: index % 8 })}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-400">
            <span>Cool (0°C)</span>
            <span>Warm (30°C)</span>
            <span>Hot (50°C)</span>
            <span>Critical (70°C+)</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Hotspots</h3>
            {data.hotspots.map((hotspot, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">Rack {String.fromCharCode(65 + hotspot.x)}{hotspot.y + 1}: {hotspot.temp}°C</span>
              </div>
            ))}
          </motion.div>

          <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Alerts</h3>
            {data.alerts.map((alert, index) => (
              <div key={index} className="text-sm text-gray-300 mb-2">{alert}</div>
            ))}
          </motion.div>
        </div>
      </div>

      {selectedCell && (
        <motion.div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">Cell Details</h3>
          <p className="text-gray-400">Position: ({selectedCell.x}, {selectedCell.y}) - Temperature: {selectedCell.temp}°C</p>
        </motion.div>
      )}
    </div>
  );
}