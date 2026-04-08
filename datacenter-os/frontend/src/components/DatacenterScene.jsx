import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Reflector, Html } from '@react-three/drei';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * RackUnit Component - Individual 3D server rack
 */
function RackUnit({ position, status, id }) {
  const groupRef = useRef();
  const lightRef = useRef();

  useFrame(() => {
    if (lightRef.current) {
      // Breathing animation for idle state lights
      lightRef.current.intensity = 0.5 + Math.sin(Date.now() * 0.002) * 0.3;
    }
  });

  // Status-based colors
  const getStatusColor = () => {
    switch (status) {
      case 'active': return '#22C55E'; // Green
      case 'warning': return '#F97316'; // Orange
      case 'critical': return '#EF4444'; // Red
      case 'idle': return '#FFD700'; // Gold
      default: return '#64748B'; // Gray
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Rack body */}
      <mesh>
        <boxGeometry args={[0.4, 2, 0.3]} />
        <meshStandardMaterial
          color="#0a0e14"
          metalness={0.7}
          roughness={0.3}
          emissive="#111"
        />
      </mesh>

      {/* Status indicator light */}
      <pointLight ref={lightRef} color={getStatusColor()} intensity={0.8} distance={2} />
      <mesh position={[0.25, 0.5, 0.2]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color={getStatusColor()}
          emissive={getStatusColor()}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Rack label */}
      <Html position={[0, -1.2, 0]} scale={0.5}>
        <div style={{
          color: '#FFD700',
          fontSize: '12px',
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: 'monospace',
          textShadow: '0 0 10px rgba(212,175,55,0.5)',
        }}>
          {id}
        </div>
      </Html>
    </group>
  );
}

/**
 * DatacenterAisle Component - The main 3D scene
 */
function DatacenterAisle({ cameraPosition }) {
  const { camera } = useThree();
  const ailesRef = useRef();

  // Animate camera based on current module
  useEffect(() => {
    if (cameraPosition) {
      gsap.to(camera.position, {
        x: cameraPosition[0],
        y: cameraPosition[1],
        z: cameraPosition[2],
        duration: 1.5,
        ease: 'power2.inOut',
      });
    }
  }, [cameraPosition, camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#D4AF37" />
      <directionalLight position={[10, 20, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, 5, 10]} intensity={0.6} color="#00F5FF" />

      {/* Environment */}
      <Environment preset="city" intensity={0.3} />

      {/* Floor with reflection */}
      <Reflector
        resolution={512}
        args={[30, 30]}
        mirror={0.3}
        mixBlur={8}
        mixStrength={2}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5, 0]}
      >
        {(Material, props) => <Material {...props} />}
      </Reflector>

      {/* Grid background */}
      <mesh position={[0, -4.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#020408"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Datacenter Aisle - Generate racks */}
      <group ref={ailesRef}>
        {/* Left row */}
        {[...Array(4)].map((_, i) => (
          <RackUnit
            key={`left-${i}`}
            position={[-8, -2 + i * 3, 0]}
            status={['active', 'warning', 'idle', 'critical'][i]}
            id={`A${i + 1}`}
          />
        ))}

        {/* Right row */}
        {[...Array(4)].map((_, i) => (
          <RackUnit
            key={`right-${i}`}
            position={[8, -2 + i * 3, 0]}
            status={['idle', 'active', 'active', 'warning'][i]}
            id={`B${i + 1}`}
          />
        ))}

        {/* Center cooling pipes */}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 20, 16]} />
          <meshStandardMaterial
            color="#2DD4BF"
            emissive="#00F5FF"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Floating datacenter info */}
      <Html position={[0, 8, -15]} scale={2}>
        <div style={{
          color: '#FFD700',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          textAlign: 'center',
          textShadow: '0 0 20px rgba(212,175,55,0.8)',
        }}>
          DATACENTER AISLE 01
          <br />
          <span style={{ fontSize: '10px', color: '#00F5FF' }}>Real-time Infrastructure Model</span>
        </div>
      </Html>
    </>
  );
}

/**
 * 3D Canvas Background Component
 * Maps current route to camera position for spatial navigation
 */
export default function DatacenterScene() {
  const location = useLocation();

  // Camera positions for each module/route
  const cameraPositions = {
    '/overview': [0, 5, 20],      // Wide shot
    '/thermal': [-5, 8, 8],       // Zoom to left rack (thermal focus)
    '/idle': [5, 6, 10],          // Right rack (consolidation)
    '/water': [0, -2, 20],        // Floor level (water/cooling)
    '/carbon': [0, 15, 0],        // Look up at ceiling (carbon/sky)
    '/network': [12, 10, 12],     // Diagonal view (networking)
    '/about': [0, 8, 0],          // Center detail
  };

  const currentCamera = cameraPositions[location.pathname] || cameraPositions['/overview'];

  return (
    <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: currentCamera, fov: 75, near: 0.1, far: 1000 }}
        performance={{ min: 0.5 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{
          alpha: true,
          antialias: true,
          depth: true,
          stencil: false,
          preserveDrawingBuffer: false,
        }}
      >
        <DatacenterAisle cameraPosition={currentCamera} />
      </Canvas>
    </div>
  );
}
