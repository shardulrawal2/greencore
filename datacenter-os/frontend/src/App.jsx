import React, { useState } from 'react';
import Navigation from './components/shared/Navigation';
import Overview from './modules/overview';
import IdleHunter from './modules/idlehunter';
import WaterWatch from './modules/waterwatch';
import CarbonClock from './modules/carbonclock';
import ThermalTrace from './modules/thermaltrace';
import LightSpeed from './modules/lightspeed';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'idlehunter': return <IdleHunter />;
      case 'waterwatch': return <WaterWatch />;
      case 'carbonclock': return <CarbonClock />;
      case 'thermaltrace': return <ThermalTrace />;
      case 'lightspeed': return <LightSpeed />;
      case 'overview':
      default:
        return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-textMain flex font-sans selection:bg-accent-green selection:text-black transition-colors duration-500">
      
      {/* Sidebar / Bottom Dock */}
      <Navigation active={activeTab} onNavigate={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen relative overflow-x-hidden pb-32 lg:pb-8">
        {/* Subtle background glow */}
        <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-green/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-[1400px] mx-auto w-full p-8 relative z-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
