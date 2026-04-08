import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Zap, Play } from 'lucide-react';
import * as d3 from 'd3';
import networkDataJson from '../data/network.json';

const defaultNodes = networkDataJson.nodes || [
  { id: 'A1', x: 100, y: 100 },
  { id: 'A2', x: 200, y: 100 },
  { id: 'B1', x: 100, y: 200 },
  { id: 'B2', x: 200, y: 200 },
  { id: 'C1', x: 150, y: 150 },
];

const defaultLinks = networkDataJson.links || [
  { source: 'A1', target: 'A2', utilization: 45 },
  { source: 'A1', target: 'B1', utilization: 67 },
  { source: 'A2', target: 'B2', utilization: 23 },
  { source: 'B1', target: 'B2', utilization: 89 },
  { source: 'C1', target: 'A1', utilization: 34 },
  { source: 'C1', target: 'A2', utilization: 56 },
  { source: 'C1', target: 'B1', utilization: 78 },
  { source: 'C1', target: 'B2', utilization: 12 },
];

export default function LightSpeed() {
  const svgRef = useRef();
  const mountedRef = useRef(true);
  const pendingTimeouts = useRef([]);
  const [networkData, setNetworkData] = useState({ nodes: defaultNodes, links: defaultLinks });
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    pendingTimeouts.current = [];

    // Slow simulation every 3 seconds for demo stability
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      setNetworkData(prev => ({
        ...prev,
        links: (prev.links || defaultLinks).map(link => ({
          ...link,
          utilization: Math.max(5, Math.min(95, (parseFloat(link.utilization) || 0) + (Math.random() - 0.5) * 8)),
        })),
      }));
    }, 3000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      pendingTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !Array.isArray(networkData.nodes) || networkData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 300;

    const safeNodes = networkData.nodes.map(node => ({ ...node, x: node.x || width / 2, y: node.y || height / 2 }));
    const safeLinks = (networkData.links || []).map(link => ({
      ...link,
      utilization: Math.max(0, Math.min(100, Number.isFinite(link.utilization) ? link.utilization : 0)),
    }));

    const simulation = d3.forceSimulation(safeNodes)
      .force('link', d3.forceLink(safeLinks).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(safeLinks)
      .enter().append('line')
      .attr('stroke', d => {
        const util = d.utilization || 0;
        return util > 80 ? '#FF4D4D' : util > 60 ? '#FFA500' : '#FFD700';
      })
      .attr('stroke-width', d => Math.max(1, ((d.utilization || 0) / 20)))
      .attr('stroke-dasharray', '5,5')
      .style('animation', 'march 2s linear infinite');

    const node = svg.append('g')
      .selectAll('circle')
      .data(safeNodes)
      .enter().append('circle')
      .attr('r', 20)
      .attr('fill', '#0F1218')
      .attr('stroke', '#FFD700')
      .attr('stroke-width', 2)
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    const labels = svg.append('g')
      .selectAll('text')
      .data(safeNodes)
      .enter().append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', '#FFD700')
      .style('font-size', '12px')
      .style('font-family', 'JetBrains Mono');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source?.x || 0))
        .attr('y1', d => (d.source?.y || 0))
        .attr('x2', d => (d.target?.x || 0))
        .attr('y2', d => (d.target?.y || 0));

      node
        .attr('cx', d => d.x || 0)
        .attr('cy', d => d.y || 0);

      labels
        .attr('x', d => d.x || 0)
        .attr('y', d => d.y || 0);
    });

    return () => {
      simulation.stop();
    };
  }, [networkData]);

  const injectTrafficSpike = () => {
    setIsSimulating(true);

    setNetworkData((prev) => {
      const linksCopy = [...(prev.links || defaultLinks)];
      const indices = [];
      for (let i = 0; i < Math.min(2, linksCopy.length); i++) {
        let idx;
        do {
          idx = Math.floor(Math.random() * linksCopy.length);
        } while (indices.includes(idx));
        indices.push(idx);
      }

      return {
        ...prev,
        links: linksCopy.map((link, idx) => {
          if (indices.includes(idx)) {
            return {
              ...link,
              utilization: Math.min(100, (link.utilization || 0) + 50),
            };
          }
          return link;
        }),
      };
    });

    // Mock local decay optimization after spike
    const optimizationTimeout = setTimeout(() => {
      if (!mountedRef.current) return;
      setNetworkData((prev) => ({
        ...prev,
        links: (prev.links || defaultLinks).map((link) => ({
          ...link,
          utilization: Math.max(30, (link.utilization || 0) * 0.85),
        })),
      }));
    }, 1500);
    pendingTimeouts.current.push(optimizationTimeout);

    const finishTimeout = setTimeout(() => {
      if (!mountedRef.current) return;
      setIsSimulating(false);
    }, 2000);
    pendingTimeouts.current.push(finishTimeout);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-sans text-white">LightSpeed</h2>
          <p className="text-gray-400">Network topology visualization and traffic optimization</p>
        </div>
        <motion.button
          onClick={injectTrafficSpike}
          disabled={isSimulating}
          className={cn(
            "bg-gold text-obsidian font-medium py-2 px-4 rounded-lg hover:bg-gold/90 transition-colors flex items-center space-x-2",
            isSimulating && "opacity-50 cursor-not-allowed"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-4 h-4" />
          <span>{isSimulating ? 'Simulating...' : 'Inject Traffic Spike'}</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="col-span-1 md:col-span-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Network Topology</h3>
            <div className="flex flex-wrap items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-0.5 bg-gold"></div>
                <span className="text-gray-400">Normal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-0.5 bg-alert-orange"></div>
                <span className="text-gray-400">Congested</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-0.5 bg-alert-red"></div>
                <span className="text-gray-400">Critical</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center flex-grow overflow-hidden w-full">
            <svg ref={svgRef} width="400" height="300" className="border border-white/10 rounded-lg max-w-full">
              <defs>
                <style>
                  {`
                    @keyframes march {
                      to {
                        stroke-dashoffset: -10;
                      }
                    }
                  `}
                </style>
              </defs>
            </svg>
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/5 p-6 h-full">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 text-gold mr-2" />
              Link Status
            </h3>
            <div className="space-y-3">
              {networkData.links.slice(0, 6).map((link, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {link.source} → {link.target}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          link.utilization > 80 ? "bg-alert-red" :
                          link.utilization > 60 ? "bg-alert-orange" : "bg-gold"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${link.utilization}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs font-mono text-white w-8">
                      {Math.round(link.utilization)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold text-white mt-6 mb-4">Network Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Avg Utilization</span>
                <span className="font-mono text-neon-teal">
                  {Math.round(networkData.links.reduce((sum, link) => sum + link.utilization, 0) / Math.max(1, networkData.links.length))}%
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Congested Links</span>
                <span className="font-mono text-alert-orange">
                  {networkData.links.filter(link => link.utilization > 80).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Bandwidth</span>
                <span className="font-mono text-gold">10Gbps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}