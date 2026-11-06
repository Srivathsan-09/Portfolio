import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * 3D Floating Photograph Card that physically emerges from the camera lens
 * Features real image texture, physical depth, hover pop-out, dynamic ambient glow,
 * and click interaction to open the existing portfolio gallery modal.
 */
export default function EmergingCard({
  item,
  index,
  targetPosition,
  targetRotation,
  isOtherHovered,
  isSelected = false,
  isOtherSelected = false,
  onHover,
  onUnhover,
  onClick,
  reducedMotion = false,
}) {
  const cardGroupRef = useRef();
  const [texture, setTexture] = useState(null);
  const [hovered, setHovered] = useState(false);

  // Load high-resolution photograph texture with sRGB color space
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      item.image,
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        setTexture(loadedTex);
      },
      undefined,
      (err) => console.warn(`Could not load texture for ${item.title}:`, err)
    );
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [item.image, item.title]);

  // Frame loop for floating idle physics, mouse hover smoothing, and cinematic card selection
  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Idle organic vertical float after emergence
    const floatY = reducedMotion ? 0 : Math.sin(time * 1.1 + index * 1.5) * 0.05;
    const floatRotZ = reducedMotion ? 0 : Math.sin(time * 0.8 + index * 1.5) * 0.015;

    // Hover & Selection translation targets
    const targetZ = isSelected ? 1.6 : hovered ? 0.45 : isOtherSelected ? -1.2 : isOtherHovered ? -0.2 : 0;
    const targetScale = isSelected ? 1.25 : hovered ? 1.1 : isOtherSelected ? 0.78 : isOtherHovered ? 0.94 : 1.0;

    // Smoothly damp position and scale
    cardGroupRef.current.position.y = THREE.MathUtils.damp(
      cardGroupRef.current.position.y,
      targetPosition[1] + (isSelected ? 0 : floatY),
      4.0,
      delta
    );
    cardGroupRef.current.position.z = THREE.MathUtils.damp(
      cardGroupRef.current.position.z,
      targetPosition[2] + targetZ,
      4.5,
      delta
    );
    cardGroupRef.current.scale.setScalar(
      THREE.MathUtils.damp(cardGroupRef.current.scale.x, targetScale, 5.0, delta)
    );

    // Damped tilt rotation
    cardGroupRef.current.rotation.z = THREE.MathUtils.damp(
      cardGroupRef.current.rotation.z,
      isSelected ? 0 : targetRotation[2] + floatRotZ,
      3.5,
      delta
    );
  });

  return (
    <group
      ref={cardGroupRef}
      position={[targetPosition[0], targetPosition[1], targetPosition[2]]}
      rotation={[targetRotation[0], targetRotation[1], targetRotation[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        if (onHover) onHover(index);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
        if (onUnhover) onUnhover();
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(item.title);
      }}
    >
      {/* 3D Dark Chassis Backing Plate */}
      <mesh position={[0, 0, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.44, 1.94, 0.04]} />
        <meshStandardMaterial
          color="#0f0f12"
          roughness={0.65}
          metalness={0.4}
        />
      </mesh>

      {/* Thin Gold/Orange Glowing Border Bezel */}
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[1.47, 1.97, 0.038]} />
        <meshStandardMaterial
          color={hovered ? '#FFA726' : '#FF9800'}
          emissive="#FF9800"
          emissiveIntensity={hovered ? 0.95 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Photograph Image Plane (Reduced ~17% while preserving 3:4 aspect ratio & full resolution) */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.40, 1.90]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            transparent={true}
            opacity={isOtherSelected ? 0.15 : isOtherHovered ? 0.55 : 1.0}
          />
        ) : (
          <meshStandardMaterial color="#1a1a20" roughness={0.8} />
        )}
      </mesh>

      {/* Subtle Orange Glow Quad behind the card */}
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[1.70, 2.20]} />
        <meshBasicMaterial
          color="#FF9800"
          transparent
          opacity={hovered ? 0.38 : 0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Interactive HTML Card Info Overlay anchored in 3D space */}
      <Html
        transform
        distanceFactor={3.6}
        position={[0, 0, 0.025]}
        className="pointer-events-none select-none w-[218px] h-[294px] flex flex-col justify-between p-3.5"
        style={{
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/15 flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9800] animate-pulse" />
            <span className="text-[9px] font-mono font-bold tracking-widest text-white/90">
              COLLECTION {item.num}
            </span>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              hovered
                ? 'bg-[#FF9800] text-black shadow-[0_0_15px_#FF9800]'
                : 'bg-black/70 text-white/60 border border-white/10'
            }`}
          >
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        {/* Bottom Title & Click CTA Pill */}
        <div className="flex flex-col gap-1.5">
          <div
            className={`p-2.5 rounded-xl backdrop-blur-md transition-all ${
              hovered
                ? 'bg-black/90 border border-[#FF9800]/80 shadow-[0_0_20px_rgba(255,152,0,0.4)]'
                : 'bg-black/75 border border-white/15 shadow-xl'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[8px] font-mono text-[#FF9800] uppercase tracking-widest block font-bold">
                  PHOTOGRAPHY
                </span>
                <h4 className="font-oswald text-lg text-white uppercase font-bold tracking-wide leading-tight">
                  {item.title}
                </h4>
              </div>

              <div
                className={`px-2 py-1 rounded-lg flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase transition-all ${
                  hovered
                    ? 'bg-[#FF9800] text-black shadow-[0_0_12px_#FF9800]'
                    : 'bg-white/10 text-white/80'
                }`}
              >
                <span>VIEW</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
