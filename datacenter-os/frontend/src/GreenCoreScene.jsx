import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Mock UI Overlay modules
import ThermalTrace from './pages/ThermalTrace';
import IdleHunter from './pages/IdleHunter';
import WaterWatch from './pages/WaterWatch';
import CarbonClock from './pages/CarbonClock';
import LightSpeed from './pages/LightSpeed';
import About from './pages/About';

// A simple server rack component
function ServerRack({ position, status, isWireframe }) {
  const meshRef = useRef();
  useFrame(() => {
    // Subtle breathing animation
    meshRef.current.position.y = position[1] + Math.sin(Date.now() / 1000) * 0.05;
  });

  const baseColor = status === 'hot' ? '#FF4D4D' : status === 'idle' ? '#FFA500' : '#1E293B';
  const emissiveColor = status === 'hot' ? '#FF0000' : status === 'idle' ? '#FF8800' : '#00F2FF';

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 2.5, 1]} />
      <meshStandardMaterial 
        color={baseColor} 
        emissive={emissiveColor} 
        emissiveIntensity={status === 'normal' ? 0.2 : 0.8}
        wireframe={isWireframe}
        roughness={0.2}
      />
    </mesh>
  );
}

// Datacenter Model with React Three Fiber
function DatacenterModel() {
  const scroll = useScroll();
  const groupRef = useRef();

  useFrame((state) => {
    // Scroll based animations
    const offset = scroll.offset; // 0 to 1
    
    // Smooth camera movements based on scroll
    // 0% - Overview
    // 20% - Thermal (Zoom to rack)
    // 40% - Idle
    // 60% - Water (Drop to floor)
    // 80% - Carbon
    // 100% - Network
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(offset * Math.PI * 2) * 5, 0.1);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5 - offset * 2, 0.1);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, offset > 0.5 ? 0.5 : 2, 0.1);
    state.camera.lookAt(0, 1, 0);
  });

  return (
    <group ref={groupRef}>
      <ServerRack position={[-2, 0, 0]} status="hot" isWireframe={false} />
      <ServerRack position={[0, 0, 0]} status="normal" isWireframe={false} />
      <ServerRack position={[2, 0, 0]} status="idle" isWireframe={false} />
      <ServerRack position={[-2, 0, -2]} status="normal" isWireframe={false} />
      <ServerRack position={[0, 0, -2]} status="normal" isWireframe={false} />
      <ServerRack position={[2, 0, -2]} status="normal" isWireframe={false} />
      
      {/* Floor reflection effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#05070A" roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
}

export default function GreenCoreScene() {
  return (
    <div className="w-screen h-screen bg-obsidian overflow-hidden">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <color attach="background" args={['#020408']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="city" />
        
        <ScrollControls pages={5} damping={0.1}>
          <DatacenterModel />
          
          <Scroll html style={{ width: '100vw' }}>
            <div className="w-full text-white pointer-events-none">
              
              {/* Header / Topbar */}
              <div className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-gradient-to-b from-obsidian to-transparent">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold to-neon-teal">
                  GreenCore OS
                </h1>
                <div className="flex space-x-6 mr-8 px-4 py-2 bg-card-bg/50 backdrop-blur-md rounded-xl border border-white/10">
                  <span className="font-mono text-neon-teal">EFFICIENCY: 98.4%</span>
                  <span className="font-mono text-alert-green">GRID: CLEAN</span>
                </div>
              </div>

              {/* Scrollable Modules Section */}
              <div className="flex flex-col space-y-[80vh] pt-[20vh] pb-[20vh] px-8 md:px-16 w-full max-w-5xl mx-auto">
                <div className="pointer-events-auto w-full md:w-full mx-auto">
                  <About />
                </div>
                <div className="pointer-events-auto w-full md:w-2/3 ml-auto">
                  <ThermalTrace />
                </div>
                <div className="pointer-events-auto w-full md:w-2/3">
                  <IdleHunter />
                </div>
                <div className="pointer-events-auto w-full md:w-2/3 ml-auto">
                  <WaterWatch />
                </div>
                <div className="pointer-events-auto w-full md:w-2/3">
                  <CarbonClock />
                </div>
                <div className="pointer-events-auto w-full md:w-2/3 ml-auto">
                  <LightSpeed />
                </div>
              </div>

            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
