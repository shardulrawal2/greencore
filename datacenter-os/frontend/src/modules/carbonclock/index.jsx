import React, { useEffect, useState } from 'react';
import { Leaf, AlertCircle, Clock, Zap, CheckCircle2 } from 'lucide-react';
import ModuleHeader from '../../components/shared/ModuleHeader';
import MetricCard from '../../components/shared/MetricCard';
import SparklineChart from '../../components/shared/SparklineChart';
import { Activity } from 'lucide-react';

const INITIAL_JOBS = [
  { id: 1, name: "Database Backup", type: "backup", duration_mins: 120, est_kwh: 50, deferrable: true },
  { id: 2, name: "Batch ETL Job", type: "batch_etl", duration_mins: 240, est_kwh: 200, deferrable: true },
  { id: 3, name: "Model Training", type: "model_training", duration_mins: 360, est_kwh: 500, deferrable: true },
  { id: 4, name: "Log Archival", type: "log_archival", duration_mins: 60, est_kwh: 20, deferrable: true },
  { id: 5, name: "User Auth Service", type: "critical", duration_mins: 0, est_kwh: 5, deferrable: false },
  { id: 6, name: "API Gateway", type: "critical", duration_mins: 0, est_kwh: 8, deferrable: false },
  { id: 7, name: "Health Monitor", type: "critical", duration_mins: 0, est_kwh: 3, deferrable: false },
  { id: 8, name: "DNS Resolution", type: "critical", duration_mins: 0, est_kwh: 2, deferrable: false }
].map(j => ({ ...j, status: 'PENDING' }));

export default function CarbonClock() {
  const [intensityData, setIntensityData] = useState({ carbon_intensity: 285, is_live: false, zone: 'IN-SO' });
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [co2Avoided, setCo2Avoided] = useState(0);
  const [history, setHistory] = useState(() => 
    Array.from({ length: 24 }, (_, i) => ({ time: i, intensity: 250 + Math.random() * 100 }))
  );

  const fetchIntensity = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/carbonclock/intensity');
      if (res.ok) {
        const data = await res.json();
        setIntensityData(data);
      } else {
        setIntensityData({ carbon_intensity: 285, is_live: false, zone: 'IN-SO (Mock)' });
      }
    } catch {
      setIntensityData({ carbon_intensity: 285, is_live: false, zone: 'IN-SO (Mock)' });
    }
  };

  useEffect(() => {
    fetchIntensity();
    const iv = setInterval(fetchIntensity, 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let newCo2 = co2Avoided;
    const newJobs = jobs.map(job => {
      let newStat = job.status;
      if (intensityData.carbon_intensity > 300 && job.deferrable) {
        if (newStat !== 'DEFERRED') {
           newStat = 'DEFERRED';
           newCo2 += job.est_kwh * (intensityData.carbon_intensity - 300) / 1000;
        }
      } else if (intensityData.carbon_intensity <= 300) {
        newStat = job.deferrable ? 'READY' : 'RUNNING';
      } else if (!job.deferrable) {
        newStat = 'RUNNING';
      }
      return { ...job, status: newStat };
    });
    setJobs(newJobs);
    setCo2Avoided(newCo2);
    // Update history
    setHistory(prev => [...prev.slice(1), { time: Date.now(), intensity: intensityData.carbon_intensity }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intensityData.carbon_intensity]);

  const ci = intensityData.carbon_intensity;
  let statusColor = 'text-accent-green';
  let gaugeColor = 'bg-accent-green shadow-[0_0_20px_#10b981]';
  let statusText = 'CLEAN — ideal execution';
  if (ci > 200 && ci <= 300) { statusColor = 'text-accent-gold'; gaugeColor='bg-accent-gold shadow-[0_0_20px_#f0b429]'; statusText = 'MODERATE — ready to run'; }
  else if (ci > 300 && ci <= 400) { statusColor = 'text-accent-orange'; gaugeColor='bg-accent-orange shadow-[0_0_20px_#f97316]'; statusText = 'HIGH — defer if possible'; }
  else if (ci > 400) { statusColor = 'text-accent-red'; gaugeColor='bg-accent-red shadow-[0_0_20px_#ef4444]'; statusText = 'CRITICAL — deferring all'; }

  const deferredJobs = jobs.filter(j => j.status === 'DEFERRED');
  const readyJobs = jobs.filter(j => j.status === 'READY' || j.status === 'RUNNING');

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-10">
        <ModuleHeader 
          title="CarbonClock" 
          subtitle="Adaptive Workload Scheduling & Grid Intensity Synchronization" 
        />
        <button 
          onClick={() => setIntensityData(p => ({ ...p, carbon_intensity: 380, zone: 'SIMULATED SPIKE' }))}
          className="relative z-10 bg-card border border-borderC text-textMuted hover:text-textMain hover:bg-white/5 hover:border-borderC px-6 py-2.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-[0.2em] flex items-center group"
        >
          <Zap className="w-3 h-3 mr-2 text-accent-amber group-hover:animate-pulse" />
          Simulate Grid Spike
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <MetricCard 
          title={() => (
            <div className="flex justify-between items-center w-full">
              <span>GRID INTENSITY VECTOR</span>
              {intensityData.is_live && <span className="text-accent-green text-[8px] animate-pulse font-mono tracking-widest border border-accent-green/30 px-1 rounded">LIVE</span>}
            </div>
          )}
          value={Math.round(ci)} 
          unit="gCO₂ / kWh" 
          statusColor={statusColor} 
        />
        <MetricCard 
          title="DEFERRED WORKLOADS" 
          value={deferredJobs.length} 
          unit="jobs" 
          statusColor={deferredJobs.length > 0 ? 'text-accent-amber' : 'text-textMuted'}
        />
        <div className="glass-panel p-6 rounded-2xl group transition-all duration-500 border-borderC">
          <div className="razor-border" />
          <div className="text-[10px] font-mono font-bold text-textMuted uppercase tracking-[0.2em] mb-4 opacity-50">CUMULATIVE MITIGATION</div>
          <div className="text-4xl metric-text text-accent-green accent-glow">
            {co2Avoided.toFixed(2)} <span className="text-xs font-mono text-accent-green/40 ml-1">kg / CO2</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div className="lg:col-span-1 space-y-10 flex flex-col h-full">
          <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden animate-breath flex-1 border-borderC">
            <div className="razor-border" />
            <h3 className="text-[10px] font-mono font-bold text-textMuted/50 uppercase tracking-[0.3em] mb-10 w-full text-left ml-4">Carbon Flux Capacitor</h3>
            
            <div className="relative mb-8">
               <div className="absolute inset-0 bg-current blur-3xl opacity-5 rounded-full pulse-slow" style={{ color: statusColor.includes('green') ? 'var(--accent-green)' : statusColor.includes('gold') ? 'var(--accent-gold)' : 'var(--accent-red)' }} />
               <div className={`text-9xl font-sans font-thin tracking-tighter drop-shadow-2xl relative z-10 transition-all duration-1000 ${statusColor}`}>{Math.round(ci)}</div>
               <div className="text-[11px] font-mono text-textMuted/40 tracking-[0.4em] uppercase mt-2">gCO2/kWh · {intensityData.zone}</div>
            </div>
            
            <div className={`mt-8 text-[11px] font-mono font-bold px-8 py-3 rounded-full border border-borderC ${statusColor} bg-white/[0.02] uppercase tracking-[0.2em] transition-all`}>
               <span className="opacity-40 font-normal mr-2">// SYSTEM STATUS //</span> {statusText}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden h-[180px] border-borderC">
            <div className="razor-border" />
            <div className="flex justify-between items-center mb-0">
               <h3 className="text-[10px] font-mono font-bold text-textMuted/50 uppercase tracking-[0.2em]">24h Intensity Trend</h3>
               <span className="text-[9px] font-mono text-accent-green opacity-40">NOMINAL VARIANCE</span>
            </div>
            <SparklineChart data={history} dataKey="intensity" color={ci > 300 ? "var(--accent-gold)" : "var(--accent-green)"} />
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl flex flex-col h-[420px] border-borderC">
          <div className="razor-border" />
          <h3 className="text-sm font-sans font-light text-textMain tracking-[0.2em] uppercase mb-10 border-b border-borderC pb-6 flex justify-between items-center">
             <span>Adaptive Schedule Queue</span>
             <span className="text-[10px] font-mono text-textMuted opacity-50 lowercase tracking-normal italic">
                {jobs.length} jobs pending window
             </span>
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            {jobs.length === 0 && <div className="text-center p-10 text-textMuted opacity-30 font-mono text-[11px] uppercase tracking-widest">Queue empty — grid synchronization optimal</div>}
            {jobs.map(j => (
              <div key={j.id} className="bg-card border border-borderC p-5 rounded-xl transition-all hover:bg-white/[0.05] group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono text-textMain font-bold uppercase tracking-tighter">{j.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    j.priority === 'High' ? 'bg-accent-red text-textMain' : 
                    j.priority === 'Medium' ? 'bg-accent-gold text-black' : 'bg-accent-green text-black'
                  }`}>
                    {j.priority}
                  </span>
                </div>
                {j.status === 'DEFERRED' && (
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-accent-green/80 bg-accent-green/5 px-2 py-0.5 rounded border border-accent-green/10">Mitigates {(j.est_kwh * (ci - 300) / 1000).toFixed(2)} kg CO₂</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-2xl border-borderC">
        <div className="razor-border" />
        <h3 className="text-sm font-sans font-light text-textMain tracking-[0.2em] uppercase mb-10 border-b border-borderC pb-6">
           Workload Allocation Map
        </h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-[11px] text-textMuted font-mono uppercase tracking-wider">
            <thead className="bg-card text-textMain opacity-40">
              <tr>
                <th className="p-6 font-bold tracking-[0.2em]">Asset Identifier</th>
                <th className="p-6 font-bold tracking-[0.2em]">Category</th>
                <th className="p-6 font-bold tracking-[0.2em] text-right">Cycle Duration</th>
                <th className="p-6 font-bold tracking-[0.2em] text-right">Energy Profile</th>
                <th className="p-6 font-bold tracking-[0.2em] text-center">Flexible</th>
                <th className="p-6 font-bold tracking-[0.2em] text-right">Status Vector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobs.map(j => (
                <tr key={j.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6 font-bold text-textMain transition-all group-hover:translate-x-2 tracking-normal uppercase">{j.name}</td>
                  <td className="p-6 opacity-60 italic">{j.type}</td>
                  <td className="p-6 text-right opacity-60">{j.duration_mins} MIN</td>
                  <td className="p-6 text-right opacity-60 text-accent-green/80 font-bold">{j.est_kwh} KWH</td>
                  <td className="p-6 text-center">{j.deferrable ? <span className="text-accent-green shadow-[0_0_8px_#00FF41]">TRUE</span> : <span className="opacity-20">—</span>}</td>
                  <td className="p-6 text-right">
                    <span className={`px-4 py-2 rounded-lg font-bold text-[9px] tracking-[0.1em]
                      ${j.status === 'READY'? 'bg-accent-green text-black shadow-[0_0_15px_#00FF41]' : ''}
                      ${j.status === 'RUNNING'? 'bg-accent-violet text-textMain shadow-[0_0_15px_#6200EE]' : ''}
                      ${j.status === 'DEFERRED'? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/40 animate-pulse shadow-[0_0_10px_#FFB800]' : ''}
                      ${j.status === 'PENDING'? 'bg-card text-textMuted opacity-50' : ''}
                    `}>
                      {j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
