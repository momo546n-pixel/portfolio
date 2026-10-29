"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Points } from "three";

/** Nuage de particules 3D en rotation lente. */
function Particles() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const n = 650;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n * 3; i++) arr[i] = (Math.random() - 0.5) * 16;
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.008;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#a78bfa"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Petit blob violet translucide qui flotte en arrière-plan. */
function FloatingBlob({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
}) {
  return (
    <Float speed={1.2} rotationIntensity={1} floatIntensity={1.6}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          distort={0.4}
          speed={1.8}
          roughness={0.3}
          metalness={0.3}
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

/**
 * Arrière-plan global, fixe derrière tout le site :
 * lumières violettes qui dérivent + couche 3D (particules + blobs).
 */
export function SiteBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Lumières violettes */}
      <div className="animate-blob absolute -left-[10%] top-[6%] h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-[130px]" />
      <div className="animate-blob absolute -right-[8%] top-[36%] h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/15 blur-[130px] [animation-delay:5s]" />
      <div className="animate-blob absolute bottom-[4%] left-[24%] h-[30rem] w-[30rem] rounded-full bg-violet-500/15 blur-[130px] [animation-delay:9s]" />
      <div className="animate-blob absolute -bottom-[6%] right-[18%] h-[26rem] w-[26rem] rounded-full bg-cyan-400/10 blur-[130px] [animation-delay:13s]" />

      {/* Couche 3D (montée côté client uniquement) */}
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={2} decay={0} color="#a78bfa" />
          <pointLight position={[-5, -3, 2]} intensity={1.6} decay={0} color="#ec4899" />
          <Particles />
          <FloatingBlob position={[-3.4, 1.6, -1]} scale={0.7} color="#8b5cf6" />
          <FloatingBlob position={[3.6, -1.4, -2]} scale={0.95} color="#a855f7" />
        </Canvas>
      )}
    </div>
  );
}
