import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { equipmentCatalog } from '../data/equipmentCatalog';
import { Bot, Cpu, Wind, Network, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Configurator({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    compute: null,
    thermal: null,
    network: null
  });

  const categories = [
    { id: 'compute', title: 'Processors', icon: Cpu },
    { id: 'thermal', title: 'Cooling', icon: Wind },
    { id: 'network', title: 'Internet connection', icon: Network }
  ];

  const currentCategory = categories[step];
  const items = equipmentCatalog[currentCategory.id];
  const selectedItem = items.find(item => item.id === selections[currentCategory.id]);

  const handleSelect = (itemId) => {
    setSelections(prev => ({ ...prev, [currentCategory.id]: itemId }));
  };

  const handleNext = () => {
    if (step < categories.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(selections);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Setup</h1>
          <p className="text-gray-400 mt-1">Choose your hardware parts for the datacenter</p>
        </div>
        <div className="flex space-x-2">
          {categories.map((cat, idx) => (
            <div 
              key={cat.id}
              className={cn(
                "h-2 w-16 rounded-full transition-all duration-300",
                idx === step ? "bg-accent-green" :
                idx < step ? "bg-accent-green/50" : "bg-white/10"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Selection Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-3 mb-6">
            <currentCategory.icon className="w-6 h-6 text-accent-green" />
            <h2 className="text-xl font-semibold text-white">Step {step + 1}: Select {currentCategory.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <motion.div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={cn(
                  "cursor-pointer p-6 rounded-xl border transition-all duration-300 backdrop-blur-md relative overflow-hidden",
                  selections[currentCategory.id] === item.id 
                    ? "bg-accent-green/10 border-accent-green shadow-[0_0_15px_rgba(0,255,128,0.1)]" 
                    : "bg-card-bg/50 border-white/5 hover:border-white/20"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selections[currentCategory.id] === item.id && (
                  <div className="absolute top-4 right-4 text-accent-green">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <h3 className="text-lg font-medium text-white mb-2">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                
                {/* Specific stats */}
                <div className="mt-auto flex items-center space-x-4 text-xs">
                  {item.powerDraw && (
                    <span className="text-gold">Energy: {item.powerDraw}W</span>
                  )}
                  {item.coolingCapacity && (
                    <span className="text-neon-teal">Cooling power: {item.coolingCapacity}</span>
                  )}
                  {item.bandwidth && (
                    <span className="text-accent-blue">Speed: {item.bandwidth}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-6 flex justify-end">
            <motion.button
              onClick={handleNext}
              disabled={!selections[currentCategory.id]}
              className={cn(
                "px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors",
                selections[currentCategory.id] 
                  ? "bg-accent-green text-black hover:bg-accent-green/90" 
                  : "bg-white/5 text-gray-500 cursor-not-allowed"
              )}
              whileHover={selections[currentCategory.id] ? { scale: 1.02 } : {}}
              whileTap={selections[currentCategory.id] ? { scale: 0.98 } : {}}
            >
              <span>{step === categories.length - 1 ? 'Finish Setup' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* AI Advisor Panel */}
        <div className="lg:col-span-1">
          <div className="bg-obsidian/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-8">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-accent-green" />
              </div>
              <div>
                <h3 className="text-white font-medium">Smart AI Helper</h3>
                <p className="text-xs text-accent-green">Always checking your choices...</p>
              </div>
            </div>

            <div className="space-y-4">
              {!selectedItem ? (
                <div className="text-sm text-gray-400 animate-pulse">
                  Pick a {currentCategory.title.toLowerCase()} option to get my advice...
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={selectedItem.id}
                  className="space-y-4"
                >
                  <div className="text-sm text-gray-300 leading-relaxed">
                    <strong>My thought on {selectedItem.name}:</strong><br/>
                    {selectedItem.aiIntegration}
                  </div>
                  
                  {selections.compute === 'compute-high-density' && step === 1 && selectedItem.id === 'thermal-air' && (
                    <div className="mt-4 p-3 bg-alert-orange/10 border border-alert-orange/20 rounded-lg text-xs text-alert-orange flex items-start space-x-2">
                       <span>⚠️</span>
                       <span>Warning: You picked big processors before, but standard air cooling might not be enough to keep them cold!</span>
                    </div>
                  )}

                  {selections.compute === 'compute-high-density' && step === 1 && selectedItem.id === 'thermal-liquid' && (
                    <div className="mt-4 p-3 bg-accent-green/10 border border-accent-green/20 rounded-lg text-xs text-accent-green flex items-start space-x-2">
                       <span>✅</span>
                       <span>Great match! Liquid cooling is perfect for those big processors.</span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            
            {/* Visual Indicator of Progress */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Your Cart</p>
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between text-xs">
                    <span className="text-gray-400">{cat.title}</span>
                    <span className="text-white truncate max-w-[120px] text-right">
                      {selections[cat.id] ? equipmentCatalog[cat.id].find(i => i.id === selections[cat.id]).name : '---'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
