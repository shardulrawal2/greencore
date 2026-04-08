import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useGreenCoreEngine } from '../hooks/useGreenCoreEngine';

export default function Layout({ children }) {
  // Activate the global GreenCore engine pulse
  useGreenCoreEngine();

  return (
    <div className="min-h-screen bg-obsidian relative">
      {/* UI Overlay */}
      <div className="relative z-10">
        <Sidebar />
        <Topbar />
        <motion.main
          className="ml-64 mt-16 p-6 global-pulse"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}