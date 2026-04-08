import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  Activity,
  Thermometer,
  Server,
  Droplets,
  Clock,
  Zap,
  Cpu
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/overview', icon: Activity },
  { name: 'ThermalTrace', href: '/thermal', icon: Thermometer },
  { name: 'IdleHunter', href: '/idle', icon: Server },
  { name: 'WaterWatch', href: '/water', icon: Droplets },
  { name: 'CarbonClock', href: '/carbon', icon: Clock },
  { name: 'LightSpeed', href: '/network', icon: Zap },
  { name: 'About', href: '/about', icon: Activity },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 bg-card-bg/50 backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-black/50">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-gold/30">
            <Cpu className="w-5 h-5 text-obsidian" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">GreenCore</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-white/5 text-gold border-l-4 border-gold shadow-[0_0_20px_rgba(255,215,0,0.1)]'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}