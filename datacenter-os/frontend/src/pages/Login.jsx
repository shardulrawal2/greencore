import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ShieldAlert, Zap, Server } from 'lucide-react';

export default function Login({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian text-white relative overflow-hidden">
      {/* Dark grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Subtle background glow */}
      <div className="absolute top-1/4 right-1/4 w-[30%] h-[30%] bg-accent-green/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30%] h-[30%] bg-accent-blue/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        className="w-full max-w-md bg-card-bg/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,255,128,0.3)]">
            <Server className="w-8 h-8 text-accent-green" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider">GreenCore</h1>
          <p className="text-gray-400 mt-2 text-center text-sm">Datacenter Operating System</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Username</label>
            <input 
              type="text" 
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-green/50 transition-colors"
              placeholder="admin@greencore.local"
              defaultValue="admin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-green/50 transition-colors"
              placeholder="••••••••"
              defaultValue="password"
            />
          </div>
          <motion.button 
            type="submit"
            className="w-full bg-accent-green text-black font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-accent-green/90 transition-all shadow-[0_0_10px_rgba(0,255,128,0.2)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Enter System</span>
            <Zap className="w-4 h-4" />
          </motion.button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500 flex items-center justify-center space-x-1">
          <ShieldAlert className="w-3 h-3" />
          <span>Secure Connection Established</span>
        </div>
      </motion.div>
    </div>
  );
}
