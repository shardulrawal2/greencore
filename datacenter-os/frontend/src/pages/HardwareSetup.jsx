import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { equipmentCatalog } from '../data/equipmentCatalog';
import { Server, Wrench, Send, Bot, CheckCircle } from 'lucide-react';

export default function HardwareSetup({ hardwareChoices }) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi! I looked at the hardware you picked. I have made a step-by-step instruction guide for you below. Let me know if you need help with any specific wire or setting!"
    }
  ]);

  const allSelectedItems = [];
  if (hardwareChoices.compute) allSelectedItems.push(equipmentCatalog.compute.find(i => i.id === hardwareChoices.compute));
  if (hardwareChoices.thermal) allSelectedItems.push(equipmentCatalog.thermal.find(i => i.id === hardwareChoices.thermal));
  if (hardwareChoices.network) allSelectedItems.push(equipmentCatalog.network.find(i => i.id === hardwareChoices.network));

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');

    // Simulate AI response interpreting the query against the selected equipment
    setTimeout(() => {
      let aiResponse = "I'm not sure about that specific detail, but always check the manufacturer's manual.";
      const lowerQuery = userMessage.toLowerCase();

      if (lowerQuery.includes('wire') || lowerQuery.includes('cable') || lowerQuery.includes('connect')) {
        if (hardwareChoices.network === 'network-fiber') {
          aiResponse = "Since you picked Fiber Optics, make sure to clean the connectors before plugging them in. Do not bend the fiber wires too tightly!";
        } else {
          aiResponse = "Simply use standard Cat6A cables and connect them to the main switches. Keep them under 100 meters length.";
        }
      } else if (lowerQuery.includes('cool') || lowerQuery.includes('sensor') || lowerQuery.includes('temp')) {
        if (hardwareChoices.thermal === 'thermal-liquid') {
          aiResponse = "For the Liquid Cooling setup, hook up the quick-disconnect tubes to the server plates and make sure the pump is running before turning on the servers.";
        } else {
          aiResponse = "Place the temperature sensors at the bottom, middle, and top of the cold aisles for the best readings.";
        }
      } else if (lowerQuery.includes('power') || lowerQuery.includes('energy')) {
        aiResponse = "Make sure you connect both power cables to different power strips for backup safety.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 800);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-3 bg-accent-blue/20 rounded-lg">
          <Wrench className="w-6 h-6 text-accent-blue" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Installation Guide</h1>
          <p className="text-gray-400 mt-1">Read the custom steps to put your datacenter together</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Scripts Area */}
        <div className="lg:col-span-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-white mb-6">Your Step-By-Step Plan</h2>
          
          {allSelectedItems.length === 0 ? (
            <div className="text-gray-400 flex items-center justify-center h-48">
              No equipment selected in the Setup page.
            </div>
          ) : (
            <div className="space-y-8">
              {allSelectedItems.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                    <h3 className="text-lg text-white font-medium">{item.name}</h3>
                  </div>
                  <div className="bg-black/60 rounded-lg p-4 font-mono text-sm text-gray-300 border border-white/10 whitespace-pre-wrap ml-7">
                    {item.implementationScript}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Helper Chat */}
        <div className="lg:col-span-1 bg-obsidian/80 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent-blue" />
            </div>
            <div>
              <h3 className="text-white font-medium">Setup Assistant</h3>
              <p className="text-xs text-gray-400">Ask me how to plug things in</p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "max-w-[85%] rounded-xl p-3 text-sm",
                  msg.sender === 'ai' 
                    ? "bg-white/10 text-white self-start rounded-tl-none ml-2" 
                    : "bg-accent-blue text-black self-end rounded-tr-none ml-auto"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex space-x-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question about wiring..."
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-blue transition-colors"
            />
            <button 
              type="submit"
              className="bg-accent-blue text-black p-2 rounded-lg hover:bg-accent-blue/90"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
