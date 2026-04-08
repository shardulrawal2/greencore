import React from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  Droplet, 
  Clock, 
  Thermometer, 
  Activity 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation = ({ active, onNavigate }) => {
    const modules = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'idlehunter', label: 'IDLEhunter', icon: Terminal },
        { id: 'waterwatch', label: 'WaterWatch', icon: Droplet },
        { id: 'carbonclock', label: 'CarbonClock', icon: Clock },
        { id: 'thermaltrace', label: 'ThermalTrace', icon: Thermometer },
        { id: 'lightspeed', label: 'LightSpeed', icon: Activity }
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden lg:flex w-64 bg-sidebar border-r border-borderC min-h-screen p-6 flex-col font-sans relative z-50 transition-colors duration-500">
                <div className="mb-12 flex items-center space-x-3 group cursor-pointer" onClick={() => onNavigate('overview')}>
                    <div className="w-8 h-8 bg-accent-green rounded-lg shadow-[0_0_15px_var(--accent-green)] flex items-center justify-center transition-transform group-hover:scale-110">
                       <div className="w-4 h-4 border-2 border-black" />
                    </div>
                    <span className="font-bold text-xl tracking-tighter text-textMain group-hover:text-accent-green transition-colors">
                        DatacenterOS
                    </span>
                </div>
                
                <ul className="space-y-4 flex-1">
                    {modules.map(module => {
                        const Icon = module.icon;
                        const isActive = active === module.id;
                        
                        return (
                            <li key={module.id}>
                                <button
                                    onClick={() => onNavigate(module.id)}
                                    className={`w-full group flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                                        isActive 
                                        ? 'bg-white/5 text-accent-green border border-borderC shadow-[0_4px_20px_rgba(0,0,0,0.1)]' 
                                        : 'text-textMuted hover:text-textMain hover:bg-white/[0.02]'
                                    }`}
                                >
                                    {isActive && <div className="absolute left-0 top-0 w-1 h-full bg-accent-green shadow-[0_0_10px_var(--accent-green)]" />}
                                    <Icon size={20} className={`${isActive ? 'text-accent-green' : 'text-textMuted opacity-50 group-hover:opacity-100'} transition-all`} />
                                    <span className={`text-sm font-medium tracking-wide ${isActive ? 'translate-x-1' : ''} transition-transform`}>
                                        {module.label}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto pt-8 border-t border-borderC flex flex-col space-y-6">
                    <ThemeToggle />
                    <div className="flex flex-col space-y-2">
                        <div className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] px-4">infrastructure status</div>
                        <div className="px-4 py-2 flex items-center space-x-3">
                           <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse shadow-[0_0_10px_var(--accent-green)]" />
                           <span className="text-[11px] font-mono text-accent-green/80 uppercase">All Nodes Healthy</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Top Theme Bar */}
            <div className="lg:hidden fixed top-6 right-6 z-[100] w-32">
                <ThemeToggle />
            </div>

            {/* Mobile Bottom Dock (Floating Glass) */}
            <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass-panel rounded-2xl h-16 px-6 flex items-center justify-between z-[100] border-borderC shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <div className="razor-border" />
                {modules.map(module => {
                    const Icon = module.icon;
                    const isActive = active === module.id;
                    
                    return (
                        <button
                            key={module.id}
                            onClick={() => onNavigate(module.id)}
                            className={`relative flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                                isActive ? 'text-accent-green scale-110 -translate-y-1' : 'text-textMuted opacity-40'
                            }`}
                        >
                            {isActive && <div className="absolute -top-1 w-1 h-1 bg-accent-green rounded-full shadow-[0_0_10px_var(--accent-green)]" />}
                            <Icon size={22} className="mb-0" />
                        </button>
                    );
                })}
            </nav>
        </>
    );
};

export default Navigation;
