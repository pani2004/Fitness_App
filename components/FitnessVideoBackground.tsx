"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedSphere({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </Sphere>
    </Float>
  );
}

function RotatingTorus({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[1.5, 0.3, 16, 100]} />
      <meshStandardMaterial 
        color={color} 
        wireframe 
        transparent 
        opacity={0.6}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function FloatingDumbbell({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime()) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Bar */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 3, 32]} />
        <meshStandardMaterial 
          color="#8B5CF6" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Left weight */}
      <mesh position={[-1.5, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 32]} />
        <meshStandardMaterial 
          color="#6366F1" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#6366F1"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Right weight */}
      <mesh position={[1.5, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 32]} />
        <meshStandardMaterial 
          color="#6366F1" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#6366F1"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#8B5CF6" />
      <pointLight position={[0, 5, 5]} intensity={1} color="#ffffff" />
      
      {/* Animated spheres */}
      <AnimatedSphere position={[-4, 2, -5]} color="#8B5CF6" speed={0.3} />
      <AnimatedSphere position={[4, -2, -5]} color="#6366F1" speed={0.4} />
      <AnimatedSphere position={[0, 3, -8]} color="#3B82F6" speed={0.2} />
      
      {/* Rotating torus */}
      <RotatingTorus position={[3, 0, -6]} color="#A78BFA" />
      <RotatingTorus position={[-3, -1, -7]} color="#818CF8" />
      
      {/* Floating dumbbells */}
      <FloatingDumbbell position={[-2, -2, -4]} />
      <FloatingDumbbell position={[2, 2, -6]} />
      
      {/* Particles */}
      {[...Array(50)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.05, 8, 8]}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20 - 5
          ]}
        >
          <meshStandardMaterial 
            color="#8B5CF6" 
            transparent 
            opacity={0.5}
            emissive="#8B5CF6"
            emissiveIntensity={0.3}
          />
        </Sphere>
      ))}
    </>
  );
}

export default function FitnessVideoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
