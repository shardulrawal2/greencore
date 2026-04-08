import React, { useEffect, useState } from 'react';
import { getSnapshot as getIdle } from '../../data/mock/serverCluster';
import { getSnapshot as getWater } from '../../data/mock/waterFlow';
import { getSnapshot as getNetwork } from '../../data/mock/networkTraffic';
import { getSnapshot as getThermal } from '../../data/mock/thermalSensors';
import ModuleHeader from '../../components/shared/ModuleHeader';

export default function Overview({ onNavigate }) {
  // Use aggressive polling to get the latest state across all modules without having to subscribe separately
  const [stamp, setStamp] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setStamp(Date.now()), 2000);
    return () => clearInterval(i);
  }, []);

  const idleData = getIdle();
  const waterData = getWater();
  const networkData = getNetwork();
  const thermalData = getThermal();

  const zombieCount = idleData.servers.filter(s=>s.state==='zombie').length;
  
  const wue = waterData.wue;
  const leaks = waterData.anomalies.length;

  const maxInlet = Math.max(...thermalData.grid.flat().map(c=>c.inlet_temp));
  const hotspotsCount = thermalData.grid.flat().filter(c=>c.inlet_temp > 32).length;

  const maxUtil = Math.max(...networkData.links.map(l=>l.utilization_pct));
  const bottleneckCount = networkData.links.filter(l=>l.utilization_pct > 80).length;

  // Global fake counters since overview doesnt have history right now
  const [energySaved, setEnergySaved] = useState(14022.45);
  const [co2Avoided, setCo2Avoided] = useState(250.31);

  useEffect(() => {
    const iv = setInterval(() => {
      setEnergySaved(prev => prev + (zombieCount * 200 * 0.0001));
      setCo2Avoided(prev => prev + 0.01);
    }, 1000);
    return () => clearInterval(iv);
  }, [zombieCount]);

  return (
    <div className="animate-in fade-in duration-500">
      <ModuleHeader 
        title="Command Center" 
        subtitle="Unified Datacenter Intelligence Aggregates" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* IDLEhunter Card */}
        <div onClick={() => onNavigate('idlehunter')} className="glass-panel group p-6 rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all duration-500">
           <div className="razor-border opacity-50 group-hover:opacity-100" />
           <div className="absolute inset-0 bg-gradient-to-t from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="text-accent-gold font-mono font-bold mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">01. IDLEHUNTER</div>
           <div className="space-y-4">
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">ZOMBIE NODES</div>
                <div className={`text-4xl metric-text ${zombieCount > 5 ? 'text-accent-red accent-glow' : 'text-textMain'}`}>{zombieCount}</div>
              </div>
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">ENERGY HARVESTED</div>
                <div className="text-accent-green metric-text text-xl">{(energySaved/1000).toFixed(2)} MWh</div>
              </div>
           </div>
        </div>

        {/* WaterWatch Card */}
        <div onClick={() => onNavigate('waterwatch')} className="glass-panel group p-6 rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all duration-500">
           <div className="razor-border opacity-50 group-hover:opacity-100" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="text-[#00E5FF] font-mono font-bold mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">02. WATERWATCH</div>
           <div className="space-y-4">
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">SYSTEM WUE</div>
                <div className={`text-4xl metric-text ${wue > 2.0 ? 'text-accent-red accent-glow' : 'text-textMain'}`}>{wue.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">ANOMALY VECTORS</div>
                <div className={`text-xl font-mono ${leaks > 0 ? 'text-accent-red' : 'text-textMuted opacity-50'}`}>{leaks > 0 ? 'CRITICAL LEAK' : 'NOMINAL'}</div>
              </div>
           </div>
        </div>

        {/* CarbonClock Card */}
        <div onClick={() => onNavigate('carbonclock')} className="glass-panel group p-6 rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all duration-500">
           <div className="razor-border opacity-50 group-hover:opacity-100" />
           <div className="absolute inset-0 bg-gradient-to-t from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="text-accent-green font-mono font-bold mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">03. CARBONCLOCK</div>
           <div className="space-y-4">
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">GRID INTENSITY</div>
                <div className="text-4xl metric-text text-textMain">285 <span className="text-xs text-textMuted font-mono opacity-50">g/CO2</span></div>
              </div>
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">SCHEDULER STATUS</div>
                <div className="text-accent-green/70 font-mono text-[11px] uppercase tracking-wider">THROUGHPUT OPTIMIZED</div>
              </div>
           </div>
        </div>

        {/* ThermalTrace Card */}
        <div onClick={() => onNavigate('thermaltrace')} className="glass-panel group p-6 rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all duration-500">
           <div className="razor-border opacity-50 group-hover:opacity-100" />
           <div className="absolute inset-0 bg-gradient-to-t from-accent-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="text-accent-red font-mono font-bold mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">04. THERMALTRACE</div>
           <div className="space-y-4">
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">MAX INLET</div>
                <div className={`text-4xl metric-text ${maxInlet > 32 ? 'text-accent-red accent-glow' : 'text-textMain'}`}>{maxInlet.toFixed(1)}°C</div>
              </div>
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">CRYO STABILITY</div>
                <div className={`text-xl font-mono ${hotspotsCount > 0 ? 'text-accent-red' : 'text-accent-green/60'}`}>{hotspotsCount > 0 ? `${hotspotsCount} HOTSPOTS` : 'OPTIMAL'}</div>
              </div>
           </div>
        </div>

        {/* LightSpeed Card */}
        <div onClick={() => onNavigate('lightspeed')} className="glass-panel group p-6 rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all duration-500">
           <div className="razor-border opacity-50 group-hover:opacity-100" />
           <div className="absolute inset-0 bg-gradient-to-t from-accent-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="text-accent-violet font-mono font-bold mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">05. LIGHTSPEED</div>
           <div className="space-y-4">
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">NET UTILIZATION</div>
                <div className={`text-4xl metric-text ${maxUtil > 80 ? 'text-accent-orange accent-glow' : 'text-textMain'}`}>{maxUtil.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-textMuted text-[10px] uppercase tracking-widest mb-1 opacity-50">NEURAL FLOW</div>
                <div className="text-accent-violet/60 font-mono text-[11px] uppercase tracking-wider">MAX-FLOW ACTIVE</div>
              </div>
           </div>
        </div>
      </div>

      <div className="glass-panel group rounded-[24px] p-10 flex flex-col md:flex-row justify-between items-center mt-12 relative overflow-hidden animate-breath">
        <div className="razor-border" />
        <div className="absolute inset-0 bg-gradient-to-r from-accent-green/[0.02] via-transparent to-accent-violet/[0.02] pointer-events-none" />
        
        <div className="p-8 w-full relative z-10 transition-transform hover:scale-105 duration-700">
          <div className="text-textMuted text-[10px] font-bold tracking-[0.4em] mb-6 opacity-40 uppercase">AGGREGATE EFFICIENCY HARVEST</div>
          <div className="text-6xl lg:text-8xl font-sans font-thin text-textMain tracking-tighter">
            {energySaved.toFixed(1)} <span className="text-xl lg:text-2xl text-accent-green font-mono tracking-widest ml-2 uppercase">kWh / SAVED</span>
          </div>
          <div className="mt-4 h-1 w-full bg-borderC rounded-full overflow-hidden">
             <div className="h-full bg-accent-green shadow-[0_0_15px_var(--accent-green)] w-[65%] animate-pulse" />
          </div>
        </div>
        
        <div className="p-8 w-full relative z-10 transition-transform hover:scale-105 duration-700 text-right">
          <div className="text-textMuted text-[10px] font-bold tracking-[0.4em] mb-6 opacity-40 uppercase">CO₂ MITIGATION VECTOR</div>
          <div className="text-6xl lg:text-8xl font-sans font-thin text-textMain tracking-tighter">
            {co2Avoided.toFixed(2)} <span className="text-xl lg:text-2xl text-accent-cyan font-mono tracking-widest ml-2 uppercase">kg / CO2</span>
          </div>
          <div className="mt-4 h-1 w-full bg-borderC rounded-full overflow-hidden flex justify-end">
             <div className="h-full bg-accent-cyan shadow-[0_0_15px_var(--accent-cyan)] w-[42%] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
