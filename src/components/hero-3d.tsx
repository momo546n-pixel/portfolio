"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Mesh } from "three";

/** Sphère 3D déformée, en rotation continue et réactive à la souris. */
function Blob() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    m.rotation.y += 0.004;
    // Parallaxe douce vers le pointeur
    m.rotation.x += (state.pointer.y * 0.5 - m.rotation.x) * 0.04;
    m.rotation.z += (-state.pointer.x * 0.4 - m.rotation.z) * 0.04;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.4}>
      <mesh ref={mesh} scale={1.45}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          emissive="#4c1d95"
          emissiveIntensity={0.35}
          distort={0.5}
          speed={2.4}
          roughness={0.2}
          metalness={0.35}
        />
      </mesh>
    </Float>
  );
}

export function Hero3D() {
  // On ne monte le canvas WebGL que côté client (évite tout souci de SSR).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full w-full" />;

  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} />
      <pointLight position={[-4, -2, -3]} intensity={3} decay={0} color="#ec4899" />
      <pointLight position={[4, 3, 2]} intensity={2.6} decay={0} color="#22d3ee" />
      <pointLight position={[0, -3, 2]} intensity={1.8} decay={0} color="#8b5cf6" />
      <Blob />
    </Canvas>
  );
}
