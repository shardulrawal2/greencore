
import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Server, Droplets, Leaf, Zap, TrendingUp } from 'lucide-react';

export default function About() {
  const modules = [
    {
      name: 'ThermalTrace',
      icon: Thermometer,
      problem: 'Hotspots can cause server failures and downtime',
      solution: 'Predict thermal issues before they happen',
      action: 'Toggle between current and predicted views',
      impact: 'Prevent costly hardware failures'
    },
    {
      name: 'IdleHunter',
      icon: Server,
      problem: 'Idle servers waste energy and resources',
      solution: 'Automatically detect and consolidate unused capacity',
      action: 'View before/after optimization states',
      impact: 'Reduce energy costs by up to 30%'
    },
    {
      name: 'WaterWatch',
      icon: Droplets,
      problem: 'Cooling inefficiencies increase water usage',
      solution: 'Monitor and optimize cooling system performance',
      action: 'Identify anomalies and benchmark against industry standards',
      impact: 'Lower water consumption and operating costs'
    },
    {
      name: 'CarbonClock',
      icon: Leaf,
      problem: 'High carbon intensity periods increase environmental impact',
      solution: 'Schedule workloads during clean energy windows',
      action: 'Defer jobs to low-carbon periods',
      impact: 'Reduce CO₂ emissions from computing'
    },
    {
      name: 'LightSpeed',
      icon: Zap,
      problem: 'Network congestion slows data center operations',
      solution: 'Visualize and optimize network traffic patterns',
      action: 'Simulate traffic spikes and watch rerouting',
      impact: 'Improve network performance and reliability'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-4">GreenCore Dashboard</h1>
        <p className="text-xl text-gray-400 max-w-4xl mx-auto">
          Smart infrastructure optimization that reduces datacenter energy, water, and carbon footprint while maintaining reliability
        </p>
      </motion.div>

      <motion.div
        className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">How GreenCore Works</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <motion.div
              key={module.name}
              className="bg-obsidian/50 rounded-lg p-6 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div className="flex items-center mb-4">
                <module.icon className="w-8 h-8 text-gold mr-3" />
                <h3 className="text-lg font-semibold text-white">{module.name}</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-red-400 mb-1">Problem</div>
                  <div className="text-sm text-gray-300">{module.problem}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-blue-400 mb-1">Solution</div>
                  <div className="text-sm text-gray-300">{module.solution}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gold mb-1">Try It</div>
                  <div className="text-sm text-gray-300">{module.action}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-green-400 mb-1">Impact</div>
                  <div className="text-sm text-gray-300">{module.impact}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Demo Experience</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">What You'll See</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 text-gold mr-2" />
                Real-time data visualizations
              </li>
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 text-gold mr-2" />
                Interactive problem-solution flows
              </li>
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 text-gold mr-2" />
                Before/after optimization states
              </li>
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 text-gold mr-2" />
                Simulated actions with immediate feedback
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Key Insights</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 text-gold mr-2" />
                Problems are clearly identified
              </li>
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 text-gold mr-2" />
                Solutions are actionable
              </li>
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 text-gold mr-2" />
                Impact is measurable
              </li>
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 text-gold mr-2" />
                Everything works offline
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}