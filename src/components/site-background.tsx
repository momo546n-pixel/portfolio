"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { Points } from "three";
import { cn } from "@/lib/utils";

type Palette = {
  /** Classes Tailwind des halos flous, selon le thème. */
  blobs: string[];
  particleColor: string;
  particleOpacity: number;
  blobColors: [string, string];
  blobOpacity: number;
  emissiveIntensity: number;
  lightColorA: string;
  lightColorB: string;
};

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    blobs: [
      "bg-violet-600/20",
      "bg-fuchsia-500/15",
      "bg-violet-500/15",
      "bg-cyan-400/10",
    ],
    particleColor: "#a78bfa",
    particleOpacity: 0.6,
    blobColors: ["#8b5cf6", "#a855f7"],
    blobOpacity: 0.55,
    emissiveIntensity: 0.4,
    lightColorA: "#a78bfa",
    lightColorB: "#ec4899",
  },
  light: {
    blobs: [
      "bg-indigo-400/15",
      "bg-violet-400/15",
      "bg-fuchsia-300/20",
      "bg-sky-300/20",
    ],
    particleColor: "#7c3aed",
    particleOpacity: 0.45,
    blobColors: ["#a78bfa", "#c084fc"],
    blobOpacity: 0.4,
    emissiveIntensity: 0.08,
    lightColorA: "#8b5cf6",
    lightColorB: "#818cf8",
  },
};

/** Nuage de particules 3D en rotation lente. */
function Particles({ color, opacity }: { color: string; opacity: number }) {
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
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Petit blob translucide qui flotte en arrière-plan. */
function FloatingBlob({
  position,
  scale,
  color,
  opacity,
  emissiveIntensity,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
  emissiveIntensity: number;
}) {
  return (
    <Float speed={1.2} rotationIntensity={1} floatIntensity={1.6}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          distort={0.4}
          speed={1.8}
          roughness={0.3}
          metalness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
    </Float>
  );
}

/**
 * Arrière-plan global, fixe derrière tout le site :
 * lumières qui dérivent + couche 3D (particules + blobs).
 * La palette change selon le thème (clair / sombre).
 */
export function SiteBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // "dark" par défaut avant montage (cohérent avec le rendu hero).
  const theme = mounted && resolvedTheme === "light" ? "light" : "dark";
  const p = PALETTES[theme];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-opacity duration-500"
    >
      {/* Lumières colorées */}
      {p.blobs.map((cls, i) => (
        <div
          key={cls}
          className={cn(
            "animate-blob absolute rounded-full blur-[130px] transition-colors duration-700",
            cls,
            [
              "-left-[10%] top-[6%] h-[32rem] w-[32rem]",
              "-right-[8%] top-[36%] h-[30rem] w-[30rem] [animation-delay:5s]",
              "bottom-[4%] left-[24%] h-[30rem] w-[30rem] [animation-delay:9s]",
              "-bottom-[6%] right-[18%] h-[26rem] w-[26rem] [animation-delay:13s]",
            ][i],
          )}
        />
      ))}

      {/* Couche 3D (montée côté client uniquement) */}
      {mounted && (
        <Canvas
          key={theme}
          camera={{ position: [0, 0, 6], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ambientLight intensity={theme === "dark" ? 0.5 : 0.85} />
          <pointLight
            position={[5, 5, 5]}
            intensity={2}
            decay={0}
            color={p.lightColorA}
          />
          <pointLight
            position={[-5, -3, 2]}
            intensity={1.6}
            decay={0}
            color={p.lightColorB}
          />
          <Particles color={p.particleColor} opacity={p.particleOpacity} />
          <FloatingBlob
            position={[-3.4, 1.6, -1]}
            scale={0.7}
            color={p.blobColors[0]}
            opacity={p.blobOpacity}
            emissiveIntensity={p.emissiveIntensity}
          />
          <FloatingBlob
            position={[3.6, -1.4, -2]}
            scale={0.95}
            color={p.blobColors[1]}
            opacity={p.blobOpacity}
            emissiveIntensity={p.emissiveIntensity}
          />
        </Canvas>
      )}
    </div>
  );
}
