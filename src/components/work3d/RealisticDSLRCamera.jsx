import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SupportingHand from './SupportingHand';

/**
 * High-fidelity 3D DSLR Camera with Modular Exploded Mechanical Assembly / Disassembly
 * Features realistic PBR materials, ergonomic body chassis, knurled controls,
 * articulated mechanical lens components that separate and assemble,
 * an authentic mechanical aperture iris, and a supporting 3D human hand.
 */
export default function RealisticDSLRCamera({
  assemblyProgress = 1.0,
  apertureOpen = 1.0,
  lensGlowIntensity = 2.5,
  reducedMotion = false,
  showHand = true,
}) {
  const cameraGroupRef = useRef();
  const lensGlowRef = useRef();
  const emitterMeshRef = useRef();
  const irisBladesRef = useRef([]);

  // Create reusable PBR materials
  const materials = useMemo(() => {
    return {
      body: new THREE.MeshStandardMaterial({
        color: '#24272f',
        roughness: 0.5,
        metalness: 0.35,
      }),
      grip: new THREE.MeshStandardMaterial({
        color: '#16171c',
        roughness: 0.88,
        metalness: 0.08,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: '#e2e6ee',
        roughness: 0.12,
        metalness: 0.95,
      }),
      knurledDial: new THREE.MeshStandardMaterial({
        color: '#2c2f38',
        roughness: 0.32,
        metalness: 0.82,
      }),
      luxuryRing: new THREE.MeshStandardMaterial({
        color: '#FF9800',
        roughness: 0.2,
        metalness: 0.65,
        emissive: '#FF9800',
        emissiveIntensity: 0.85,
      }),
      lensBarrel: new THREE.MeshStandardMaterial({
        color: '#282b35',
        roughness: 0.42,
        metalness: 0.55,
      }),
      rubberRing: new THREE.MeshStandardMaterial({
        color: '#14151a',
        roughness: 0.85,
        metalness: 0.15,
      }),
      bladeMetal: new THREE.MeshStandardMaterial({
        color: '#181920',
        roughness: 0.35,
        metalness: 0.75,
        side: THREE.DoubleSide,
      }),
      opticalGlass: new THREE.MeshPhysicalMaterial({
        color: '#142538',
        transmission: 0.82,
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
        transmission: 0.58,
        opacity: 0.82,
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

  // Calculate dynamic component separation offsets based on assemblyProgress (0 = exploded, 1 = assembled)
  const sep = Math.max(0, 1 - assemblyProgress);

  // Continuous floating, vertical axis rotation, and mouse tracking
  useFrame((state, delta) => {
    if (!cameraGroupRef.current) return;
    const time = state.clock.getElapsedTime();

    if (!reducedMotion) {
      // Subtle organic breathing float
      cameraGroupRef.current.position.y = Math.sin(time * 0.9) * 0.06;

      // Slow vertical rotation and responsive cursor tracking
      const targetRotX = (state.pointer.y * -0.1) + Math.sin(time * 0.7) * 0.02;
      const targetRotY = (state.pointer.x * 0.16) + Math.sin(time * 0.5) * 0.035;
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

      // Animate mechanical iris blades based on apertureOpen
      if (irisBladesRef.current.length > 0) {
        const bladeAngle = THREE.MathUtils.lerp(0.12, 0.42, apertureOpen);
        irisBladesRef.current.forEach((blade, i) => {
          if (blade) {
            blade.rotation.z = bladeAngle + (i * Math.PI) / 4;
          }
        });
      }
    }

    // Gentle ambient pulsing of the inner lens projection light
    if (lensGlowRef.current) {
      const pulse = Math.sin(time * 2.2) * 0.45;
      lensGlowRef.current.intensity = (lensGlowIntensity || 2.5) + pulse;
    }
  });

  return (
    <group ref={cameraGroupRef} position={[0, 0, 0]} rotation={[0.04, -0.12, 0.02]}>
      
      {/* =========================================================================
          1. 3D HUMAN SUPPORTING HAND BENEATH CAMERA
         ========================================================================= */}
      {showHand && (
        <SupportingHand
          position={[0.22, -1.05, -0.05]}
          rotation={[0.28, -0.55, 0.32]}
          scale={11.0}
          reducedMotion={reducedMotion}
        />
      )}

      {/* =========================================================================
          2. MAIN CAMERA BODY CORE
         ========================================================================= */}
      <group position={[0, 0, -0.35 * sep]}>
        {/* Central Magnesium Alloy Chassis */}
        <mesh material={materials.body} position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.42, 0.9]} />
        </mesh>

        {/* Right Hand Ergonomic Leatherette Grip */}
        <mesh material={materials.grip} position={[0.95, -0.02, 0.22]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 1.38, 1.15]} />
        </mesh>

        {/* Grip Front Textured Curve */}
        <mesh material={materials.grip} position={[1.12, -0.02, 0.65]}>
          <cylinderGeometry args={[0.22, 0.24, 1.36, 16]} />
        </mesh>

        {/* Left Shoulder Bevel */}
        <mesh material={materials.body} position={[-0.95, 0.05, 0]}>
          <boxGeometry args={[0.4, 1.3, 0.85]} />
        </mesh>

        {/* Pentaprism Base */}
        <mesh material={materials.body} position={[0, 0.88, 0.02]} castShadow>
          <boxGeometry args={[1.05, 0.46, 0.88]} />
        </mesh>

        {/* Sloped Pentaprism Apex */}
        <mesh material={materials.body} position={[0, 1.02, 0.18]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[0.9, 0.28, 0.4]} />
        </mesh>

        {/* Pentaprism Front Metal Brand Plate */}
        <mesh material={materials.metal} position={[0, 1.02, 0.38]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[0.55, 0.08, 0.02]} />
        </mesh>
        <mesh material={materials.luxuryRing} position={[0, 0.99, 0.38]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[0.45, 0.015, 0.022]} />
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

        {/* Rear LCD Screen */}
        <mesh material={materials.knurledDial} position={[-0.15, -0.05, -0.46]}>
          <boxGeometry args={[1.35, 0.95, 0.04]} />
        </mesh>
        <mesh material={materials.metal} position={[-0.15, -0.05, -0.47]}>
          <boxGeometry args={[1.25, 0.85, 0.01]} />
        </mesh>

        {/* Top Mode Dial */}
        <mesh material={materials.knurledDial} position={[-0.72, 0.82, -0.06]}>
          <cylinderGeometry args={[0.24, 0.24, 0.15, 24]} />
        </mesh>
        <mesh material={materials.metal} position={[-0.72, 0.88, -0.06]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
        </mesh>

        {/* Shutter Button & Chrome Ring */}
        <group position={[0.98, 0.74, 0.48]} rotation={[0.25, 0, -0.15]}>
          <mesh material={materials.metal}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 24]} />
          </mesh>
          <mesh material={materials.body} position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
          </mesh>
        </group>

        {/* Front Command Dial */}
        <mesh material={materials.knurledDial} position={[0.98, 0.55, 0.78]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.22, 16]} />
        </mesh>

        {/* AF Illuminator Amber Lamp */}
        <mesh material={materials.luxuryRing} position={[0.55, 0.45, 0.52]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
        </mesh>

        {/* Mount Align Red Dot */}
        <mesh material={materials.accentRed} position={[-0.52, 0.48, 0.48]}>
          <sphereGeometry args={[0.035, 12, 12]} />
        </mesh>
      </group>

      {/* =========================================================================
          3. ARTICULATED TELEPHOTO LENS ASSEMBLY (Extending along +Z)
             Each component separates and locks with mechanical rotation
         ========================================================================= */}
      <group position={[0, 0, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
        
        {/* Component 1: Stainless Steel Bayonet Mount Flange */}
        <group position={[0, -(0.04 + sep * 0.12), 0]}>
          <mesh material={materials.metal}>
            <cylinderGeometry args={[0.62, 0.62, 0.08, 32]} />
          </mesh>
        </group>

        {/* Component 2: Mount Base Barrel Collar */}
        <group
          position={[0, -(0.18 + sep * 0.35), 0]}
          rotation={[0, -0.3 * sep, 0]}
        >
          <mesh material={materials.lensBarrel}>
            <cylinderGeometry args={[0.58, 0.60, 0.28, 32]} />
          </mesh>
        </group>

        {/* Component 3: Distance Scale Indicator Window Housing */}
        <group position={[0, -(0.42 + sep * 0.6), 0]}>
          <mesh material={materials.body}>
            <cylinderGeometry args={[0.58, 0.58, 0.22, 32]} />
          </mesh>
          <mesh material={materials.opticalGlass} position={[0, 0, 0.54]}>
            <boxGeometry args={[0.32, 0.12, 0.1]} />
          </mesh>
        </group>

        {/* Component 4: Knurled Zoom Ring */}
        <group
          position={[0, -(0.76 + sep * 0.95), 0]}
          rotation={[0, 0.55 * sep, 0]}
        >
          <mesh material={materials.rubberRing}>
            <cylinderGeometry args={[0.61, 0.59, 0.48, 32]} />
          </mesh>
        </group>

        {/* Component 5: Mechanical Aperture Iris Assembly with 8 Blades */}
        <group position={[0, -(1.02 + sep * 1.3), 0]}>
          {/* Aperture Housing Ring */}
          <mesh material={materials.bladeMetal}>
            <cylinderGeometry args={[0.56, 0.56, 0.06, 32]} />
          </mesh>
          {/* 8 Articulated Aperture Blades */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => {
            const angle = (b * Math.PI * 2) / 8;
            const r = 0.28;
            return (
              <group
                key={b}
                ref={(el) => (irisBladesRef.current[b] = el)}
                position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}
                rotation={[0, angle, 0]}
              >
                <mesh material={materials.bladeMetal} position={[0.12, 0, 0]}>
                  <boxGeometry args={[0.26, 0.015, 0.08]} />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Component 6: Internal Optical Glass Element (Biconcave) */}
        <group position={[0, -(1.14 + sep * 1.55), 0]}>
          <mesh
            material={materials.innerGlass}
            rotation={[Math.PI, 0, 0]}
          >
            <sphereGeometry args={[0.48, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.28]} />
          </mesh>
        </group>

        {/* Component 7: Focus Ring with Fine Longitudinal Ridges */}
        <group
          position={[0, -(1.22 + sep * 1.9), 0]}
          rotation={[0, -0.65 * sep, 0]}
        >
          <mesh material={materials.rubberRing}>
            <cylinderGeometry args={[0.62, 0.61, 0.46, 32]} />
          </mesh>
        </group>

        {/* Component 8: SIGNATURE LUXURY ORANGE / L-SERIES ACCENT RING */}
        <group position={[0, -(1.48 + sep * 2.25), 0]}>
          <mesh material={materials.luxuryRing}>
            <cylinderGeometry args={[0.628, 0.628, 0.05, 32]} />
          </mesh>
        </group>

        {/* Component 9: Flared Outer Front Barrel & Hood Mount */}
        <group
          position={[0, -(1.74 + sep * 2.65), 0]}
          rotation={[0, 0.45 * sep, 0]}
        >
          <mesh material={materials.lensBarrel}>
            <cylinderGeometry args={[0.70, 0.62, 0.48, 32]} />
          </mesh>
          <mesh material={materials.body} position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.58, 0.52, 0.2, 32]} />
          </mesh>
        </group>

        {/* Component 10: Front Convex Aspherical Optical Glass Element */}
        <group position={[0, -(1.86 + sep * 3.0), 0]}>
          <mesh
            material={materials.opticalGlass}
            rotation={[Math.PI, 0, 0]}
          >
            <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.32]} />
          </mesh>
        </group>

        {/* Component 11: Front Filter Thread & Orange Retaining Ring */}
        <group
          position={[0, -(1.96 + sep * 3.35), 0]}
          rotation={[0, -0.75 * sep, 0]}
        >
          <mesh material={materials.metal}>
            <cylinderGeometry args={[0.68, 0.68, 0.04, 32]} />
          </mesh>
          <mesh material={materials.luxuryRing} position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.672, 0.672, 0.02, 32]} />
          </mesh>
        </group>

        {/* Component 12: Glowing Projection Emitter Disc (Where photos emerge) */}
        <mesh
          ref={emitterMeshRef}
          material={materials.emitter}
          position={[0, -(1.35 + sep * 1.8), 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.42, 32]} />
        </mesh>

        {/* Intense Internal Amber Point Light Inside the Lens */}
        <pointLight
          ref={lensGlowRef}
          position={[0, -(1.8 + sep * 2.5), 0]}
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
