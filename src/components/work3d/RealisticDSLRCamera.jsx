import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * High-fidelity 3D DSLR Camera Model
 * Features realistic PBR materials, ergonomic body chassis, knurled controls,
 * stepped telephoto lens barrel with iconic orange accent ring, multi-coated
 * optical glass elements, and an internal amber projection emitter.
 */
export default function RealisticDSLRCamera({
  lensGlowIntensity = 2.5,
  reducedMotion = false,
}) {
  const cameraGroupRef = useRef();
  const lensGlowRef = useRef();
  const emitterMeshRef = useRef();

  // Create reusable PBR materials
  const materials = useMemo(() => {
    return {
      body: new THREE.MeshStandardMaterial({
        color: '#22242b',
        roughness: 0.52,
        metalness: 0.35,
      }),
      grip: new THREE.MeshStandardMaterial({
        color: '#16171b',
        roughness: 0.88,
        metalness: 0.08,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: '#dce0e8',
        roughness: 0.12,
        metalness: 0.95,
      }),
      knurledDial: new THREE.MeshStandardMaterial({
        color: '#2d3038',
        roughness: 0.3,
        metalness: 0.85,
      }),
      luxuryRing: new THREE.MeshStandardMaterial({
        color: '#FF9800',
        roughness: 0.2,
        metalness: 0.6,
        emissive: '#FF9800',
        emissiveIntensity: 0.85,
      }),
      lensBarrel: new THREE.MeshStandardMaterial({
        color: '#262932',
        roughness: 0.42,
        metalness: 0.55,
      }),
      rubberRing: new THREE.MeshStandardMaterial({
        color: '#14151a',
        roughness: 0.85,
        metalness: 0.15,
      }),
      opticalGlass: new THREE.MeshPhysicalMaterial({
        color: '#142538',
        transmission: 0.78,
        opacity: 0.94,
        transparent: true,
        roughness: 0.02,
        ior: 1.62,
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        sheen: 1.0,
        sheenColor: new THREE.Color('#38bdf8'),
        sheenRoughness: 0.1,
      }),
      innerGlass: new THREE.MeshPhysicalMaterial({
        color: '#FF9800',
        transmission: 0.55,
        opacity: 0.8,
        transparent: true,
        roughness: 0.05,
        ior: 1.52,
        emissive: '#FF9800',
        emissiveIntensity: 0.35,
      }),
      emitter: new THREE.MeshBasicMaterial({
        color: '#FFA726',
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      }),
      accentRed: new THREE.MeshBasicMaterial({
        color: '#E53935',
      }),
    };
  }, []);

  // Continuous floating and subtle cursor-following tilt
  useFrame((state, delta) => {
    if (!cameraGroupRef.current) return;
    const time = state.clock.getElapsedTime();

    if (!reducedMotion) {
      // Subtle organic breathing float
      cameraGroupRef.current.position.y = Math.sin(time * 0.9) * 0.06;

      // Smooth damped rotation following cursor
      const targetRotX = (state.pointer.y * -0.12) + Math.sin(time * 0.7) * 0.02;
      const targetRotY = (state.pointer.x * 0.18) + Math.sin(time * 0.5) * 0.03;
      const targetRotZ = Math.sin(time * 0.6) * 0.012;

      cameraGroupRef.current.rotation.x = THREE.MathUtils.damp(
        cameraGroupRef.current.rotation.x,
        targetRotX,
        3.5,
        delta
      );
      cameraGroupRef.current.rotation.y = THREE.MathUtils.damp(
        cameraGroupRef.current.rotation.y,
        targetRotY,
        3.5,
        delta
      );
      cameraGroupRef.current.rotation.z = THREE.MathUtils.damp(
        cameraGroupRef.current.rotation.z,
        targetRotZ,
        3.5,
        delta
      );
    }

    // Gentle ambient pulsing of the inner lens light
    if (lensGlowRef.current) {
      const pulse = Math.sin(time * 2.2) * 0.45;
      lensGlowRef.current.intensity = (lensGlowIntensity || 2.5) + pulse;
    }
  });

  return (
    <group ref={cameraGroupRef} position={[0, 0, 0]} rotation={[0.04, -0.12, 0.02]}>
      {/* =========================================================================
          1. MAIN CAMERA BODY CORE
         ========================================================================= */}
      {/* Central Chassis */}
      <mesh material={materials.body} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.42, 0.9]} />
      </mesh>

      {/* Right Hand Ergonomic Grip */}
      <mesh material={materials.grip} position={[0.95, -0.02, 0.22]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 1.38, 1.15]} />
      </mesh>

      {/* Grip Front Textured Curve */}
      <mesh material={materials.grip} position={[1.12, -0.02, 0.65]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 1.36, 16]} />
      </mesh>

      {/* Left Shoulder Bevel */}
      <mesh material={materials.body} position={[-0.95, 0.05, 0]}>
        <boxGeometry args={[0.4, 1.3, 0.85]} />
      </mesh>

      {/* =========================================================================
          2. PENTAPRISM & VIEWFINDER HOUSING (TOP)
         ========================================================================= */}
      {/* Sloped Pentaprism Base */}
      <mesh material={materials.body} position={[0, 0.88, 0.02]} castShadow>
        <boxGeometry args={[1.05, 0.46, 0.88]} />
      </mesh>

      {/* Sloped Front Apex */}
      <mesh material={materials.body} position={[0, 1.02, 0.18]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[0.9, 0.28, 0.4]} />
      </mesh>
      {/* Front Pentaprism Metal Brand Plate */}
      <mesh material={materials.metal} position={[0, 1.02, 0.38]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[0.55, 0.08, 0.02]} />
      </mesh>
      {/* Subtle Orange Inset Line on Brand Plate */}
      <mesh material={materials.luxuryRing} position={[0, 0.99, 0.38]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[0.45, 0.015, 0.022]} />
      </mesh>

      {/* Focus Assist / AF Illuminator Amber Lamp */}
      <mesh material={materials.luxuryRing} position={[0.55, 0.45, 0.52]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
      </mesh>

      {/* Flash Hot Shoe Rails */}
      <mesh material={materials.metal} position={[0, 1.14, -0.02]}>
        <boxGeometry args={[0.34, 0.06, 0.38]} />
      </mesh>
      <mesh material={materials.knurledDial} position={[0, 1.12, -0.02]}>
        <boxGeometry args={[0.22, 0.08, 0.28]} />
      </mesh>

      {/* Rear Viewfinder Ocular */}
      <mesh material={materials.rubberRing} position={[0, 0.88, -0.52]}>
        <boxGeometry args={[0.52, 0.36, 0.16]} />
      </mesh>
      <mesh material={materials.metal} position={[0, 0.88, -0.57]}>
        <boxGeometry args={[0.36, 0.24, 0.04]} />
      </mesh>

      {/* Large Rear LCD Display Screen */}
      <mesh material={materials.knurledDial} position={[-0.15, -0.05, -0.46]}>
        <boxGeometry args={[1.35, 0.95, 0.04]} />
      </mesh>
      <mesh material={materials.metal} position={[-0.15, -0.05, -0.47]}>
        <boxGeometry args={[1.25, 0.85, 0.01]} />
      </mesh>

      {/* =========================================================================
          3. TOP CONTROLS & DIALS
         ========================================================================= */}
      {/* Mode Dial (Left Shoulder) */}
      <mesh material={materials.knurledDial} position={[-0.72, 0.82, -0.06]}>
        <cylinderGeometry args={[0.24, 0.24, 0.15, 24]} />
      </mesh>
      <mesh material={materials.metal} position={[-0.72, 0.88, -0.06]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
      </mesh>

      {/* Shutter Button & Chrome Ring (Angled Grip Top) */}
      <group position={[0.98, 0.74, 0.48]} rotation={[0.25, 0, -0.15]}>
        <mesh material={materials.metal}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 24]} />
        </mesh>
        <mesh material={materials.body} position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
        </mesh>
      </group>

      {/* Front Command Dial (Embedded in grip) */}
      <mesh material={materials.knurledDial} position={[0.98, 0.55, 0.78]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.22, 16]} />
      </mesh>

      {/* Mount Align Red Dot */}
      <mesh material={materials.accentRed} position={[-0.52, 0.48, 0.48]}>
        <sphereGeometry args={[0.035, 12, 12]} />
      </mesh>

      {/* =========================================================================
          4. PROFESSIONAL TELEPHOTO LENS ASSEMBLY (Extending along +Z)
         ========================================================================= */}
      <group position={[0, 0, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Stainless Steel Lens Bayonet Mount */}
        <mesh material={materials.metal} position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.62, 0.62, 0.08, 32]} />
        </mesh>

        {/* Section 1: Mount Base Barrel Collar */}
        <mesh material={materials.lensBarrel} position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.58, 0.60, 0.28, 32]} />
        </mesh>

        {/* Section 2: Distance Scale Indicator Window */}
        <mesh material={materials.body} position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.22, 32]} />
        </mesh>
        {/* Scale Window Glass Cover */}
        <mesh material={materials.opticalGlass} position={[0, -0.42, 0.54]}>
          <boxGeometry args={[0.32, 0.12, 0.1]} />
        </mesh>

        {/* Section 3: Zoom Ring with Rubber Knurling */}
        <mesh material={materials.rubberRing} position={[0, -0.76, 0]}>
          <cylinderGeometry args={[0.61, 0.59, 0.48, 32]} />
        </mesh>

        {/* Section 4: Focus Ring with Fine Longitudinal Ridges */}
        <mesh material={materials.rubberRing} position={[0, -1.22, 0]}>
          <cylinderGeometry args={[0.62, 0.61, 0.46, 32]} />
        </mesh>

        {/* SECTION 5: SIGNATURE LUXURY ORANGE / L-SERIES ACCENT RING */}
        <mesh material={materials.luxuryRing} position={[0, -1.48, 0]}>
          <cylinderGeometry args={[0.628, 0.628, 0.05, 32]} />
        </mesh>

        {/* Section 6: Flared Outer Front Barrel & Hood Mount */}
        <mesh material={materials.lensBarrel} position={[0, -1.74, 0]}>
          <cylinderGeometry args={[0.70, 0.62, 0.48, 32]} />
        </mesh>

        {/* Front Lens Cavity (Recessed Inner Stepped Bezel) */}
        <mesh material={materials.body} position={[0, -1.88, 0]}>
          <cylinderGeometry args={[0.58, 0.52, 0.2, 32]} />
        </mesh>

        {/* Front Filter Thread Ring with Satin Metal Finish */}
        <mesh material={materials.metal} position={[0, -1.96, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.04, 32]} />
        </mesh>

        {/* Front Elegant Orange Lens Rim Ring */}
        <mesh material={materials.luxuryRing} position={[0, -1.98, 0]}>
          <cylinderGeometry args={[0.672, 0.672, 0.02, 32]} />
        </mesh>

        {/* =========================================================================
            5. OPTICAL GLASS ELEMENTS & PROJECTION EMITTER CORE
           ========================================================================= */}
        {/* Front Convex Aspherical Optical Glass Element */}
        <mesh
          material={materials.opticalGlass}
          position={[0, -1.86, 0]}
          rotation={[Math.PI, 0, 0]}
        >
          <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.32]} />
        </mesh>

        {/* Secondary Internal Amber Element */}
        <mesh
          material={materials.innerGlass}
          position={[0, -1.6, 0]}
          rotation={[Math.PI, 0, 0]}
        >
          <sphereGeometry args={[0.48, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.28]} />
        </mesh>

        {/* Glowing Lens Projection Emitter Disc (Where photos emerge!) */}
        <mesh
          ref={emitterMeshRef}
          material={materials.emitter}
          position={[0, -1.35, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.42, 32]} />
        </mesh>

        {/* Intense Internal Amber Point Light Inside the Lens */}
        <pointLight
          ref={lensGlowRef}
          position={[0, -1.8, 0]}
          color="#FF9800"
          intensity={lensGlowIntensity}
          distance={5.0}
          decay={1.8}
        />
      </group>

      {/* Dedicated Warm Orange Rim Silhouette Light behind camera body */}
      <pointLight
        position={[0, 0.4, -1.3]}
        color="#FF9800"
        intensity={5.5}
        distance={4.8}
        decay={1.8}
      />

      {/* Warm Top Edge Contour Light */}
      <pointLight
        position={[0, 2.2, 0.2]}
        color="#FFE0B2"
        intensity={2.6}
        distance={4.2}
        decay={2.0}
      />
    </group>
  );
}
