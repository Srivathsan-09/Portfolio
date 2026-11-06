import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SupportingHand from './SupportingHand';

/**
 * High-fidelity 3D DSLR Camera using authentic detailed GLB 3D model
 * Features:
 * - Real DSLR mesh: chassis, front cover, pentaprism, hot shoe, dials, viewfinder, shutter release
 * - Separately accessible lens components for real mechanical assembly/disassembly
 * - Articulated mechanical 8-blade aperture iris
 * - Warm amber optical core glow and projection flare
 * - Synchronized supporting 3D human hand cradling the camera underside
 * - Smooth organic floating physics and responsive cursor tracking
 */
export default function RealisticDSLRCamera({
  assemblyProgress = 1.0,
  apertureOpen = 1.0,
  lensGlowIntensity = 2.5,
  reducedMotion = false,
  showHand = true,
  cameraAnimRef,
}) {
  const cameraGroupRef = useRef();
  const innerModelRef = useRef();
  const irisBladesRef = useRef([]);
  const coreLightRef = useRef();

  // Load the authentic DSLR camera GLB model
  const { scene } = useGLTF('/dslr_camera.glb');

  // Clone scene and configure node references and PBR materials
  const { clonedScene, lens, lensBase } = useMemo(() => {
    const clone = scene.clone(true);

    // Individual lens components for mechanical assembly/disassembly
    const lensObj = {
      mount: clone.getObjectByName('mount_ring'),
      presetAperture: clone.getObjectByName('preset_aperture_ring'),
      focusing: clone.getObjectByName('focusing_ring'),
      rubber: clone.getObjectByName('rubber_ring'),
      front: clone.getObjectByName('front_ring'),
      nameRing: clone.getObjectByName('name_ring'),
      glass: clone.getObjectByName('lense'),
    };

    // Store original resting coordinates for mathematically exact re-assembly
    const base = {};
    Object.entries(lensObj).forEach(([key, node]) => {
      if (node) {
        base[key] = {
          pos: node.position.clone(),
          rot: node.rotation.clone(),
        };
      }
    });

    // Premium PBR materials for photorealistic DSLR camera rendering
    const chassisMat = new THREE.MeshStandardMaterial({
      color: '#1b1d22',
      roughness: 0.46,
      metalness: 0.35,
    });

    const gripMat = new THREE.MeshStandardMaterial({
      color: '#101216',
      roughness: 0.88,
      metalness: 0.08,
    });

    const brushedMetalMat = new THREE.MeshStandardMaterial({
      color: '#d4d8de',
      roughness: 0.16,
      metalness: 0.94,
    });

    const blackMetalMat = new THREE.MeshStandardMaterial({
      color: '#22252c',
      roughness: 0.30,
      metalness: 0.84,
    });

    // Signature luxury amber accent ring around the lens barrel
    const amberAccentMat = new THREE.MeshStandardMaterial({
      color: '#FF9800',
      roughness: 0.22,
      metalness: 0.75,
      emissive: '#FF9800',
      emissiveIntensity: 0.45,
    });

    // Multi-coated optical glass element with amber anti-reflective sheen
    const opticalGlassMat = new THREE.MeshPhysicalMaterial({
      color: '#0e1d2c',
      transmission: 0.90,
      opacity: 0.94,
      transparent: true,
      roughness: 0.02,
      ior: 1.62,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      sheen: 1.0,
      sheenColor: new THREE.Color('#FF9800'),
      sheenRoughness: 0.15,
    });

    // Traverse and assign materials and shadows
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name.toLowerCase();
        const parentName = child.parent?.name?.toLowerCase() || '';

        if (name.includes('lense') || parentName.includes('lense')) {
          child.material = opticalGlassMat;
        } else if (name.includes('name_ring') || parentName.includes('name_ring')) {
          child.material = amberAccentMat;
        } else if (name.includes('rubber') || parentName.includes('rubber')) {
          child.material = gripMat;
        } else if (
          name.includes('shutter') ||
          name.includes('shoe') ||
          name.includes('mount') ||
          parentName.includes('shutter') ||
          parentName.includes('shoe') ||
          parentName.includes('mount')
        ) {
          child.material = brushedMetalMat;
        } else if (
          name.includes('focusing') ||
          name.includes('preset') ||
          parentName.includes('focusing') ||
          parentName.includes('preset')
        ) {
          child.material = blackMetalMat;
        } else {
          child.material = chassisMat;
        }
      }
    });

    return { clonedScene: clone, lens: lensObj, lensBase: base };
  }, [scene]);

  // Articulated 8-blade mechanical aperture iris blades
  const apertureBlades = useMemo(() => {
    const blades = [];
    const bladeGeometry = new THREE.PlaneGeometry(0.32, 0.65);
    const bladeMaterial = new THREE.MeshStandardMaterial({
      color: '#121316',
      roughness: 0.35,
      metalness: 0.85,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      blades.push({ id: i, angle, geometry: bladeGeometry, material: bladeMaterial });
    }
    return blades;
  }, []);

  // Frame loop for floating physics, cursor tracking, and mechanical lens animation
  useFrame((state, delta) => {
    if (!cameraGroupRef.current) return;
    const time = state.clock.getElapsedTime();

    if (!reducedMotion) {
      // Gentle cinematic floating oscillation
      cameraGroupRef.current.position.y = Math.sin(time * 0.95) * 0.055;

      // Hero 3/4 camera orientation facing towards the viewer with smooth cursor parallax
      // Lens native +X points to +Z when rotated by -Math.PI / 2
      const baseRotY = -Math.PI / 2 + 0.32;
      const targetRotX = 0.06 + state.pointer.y * -0.12;
      const targetRotY = baseRotY + state.pointer.x * 0.18 + Math.sin(time * 0.5) * 0.02;
      const targetRotZ = -0.03 + Math.sin(time * 0.7) * 0.015;

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

    // Read continuous animated properties (from ref if provided, otherwise props)
    const currentAssembly = cameraAnimRef?.current ? cameraAnimRef.current.assembly : assemblyProgress;
    const currentAperture = cameraAnimRef?.current ? cameraAnimRef.current.aperture : apertureOpen;
    const currentGlow = cameraAnimRef?.current ? cameraAnimRef.current.glow : lensGlowIntensity;

    // Mechanical Lens Component Assembly / Disassembly Animation along optical axis (+X)
    const sep = Math.max(0, 1 - currentAssembly);

    if (lens.mount && lensBase.mount) {
      lens.mount.position.x = lensBase.mount.pos.x + sep * 0.45;
    }
    if (lens.presetAperture && lensBase.presetAperture) {
      lens.presetAperture.position.x = lensBase.presetAperture.pos.x + sep * 1.05;
      lens.presetAperture.rotation.x = lensBase.presetAperture.rot.x + sep * 1.8;
    }
    if (lens.focusing && lensBase.focusing) {
      lens.focusing.position.x = lensBase.focusing.pos.x + sep * 1.75;
      lens.focusing.rotation.x = lensBase.focusing.rot.x - sep * 2.4;
    }
    if (lens.rubber && lensBase.rubber) {
      lens.rubber.position.x = lensBase.rubber.pos.x + sep * 2.45;
    }
    if (lens.front && lensBase.front) {
      lens.front.position.x = lensBase.front.pos.x + sep * 3.15;
      lens.front.rotation.x = lensBase.front.rot.x + sep * 1.5;
    }
    if (lens.nameRing && lensBase.nameRing) {
      lens.nameRing.position.x = lensBase.nameRing.pos.x + sep * 3.65;
    }
    if (lens.glass && lensBase.glass) {
      lens.glass.position.x = lensBase.glass.pos.x + sep * 4.15;
    }

    // Animate mechanical iris blades based on apertureOpen
    if (irisBladesRef.current.length > 0) {
      const bladeAngle = THREE.MathUtils.lerp(0.12, 0.48, currentAperture);
      irisBladesRef.current.forEach((blade, i) => {
        if (blade) {
          blade.rotation.z = bladeAngle + (i * Math.PI) / 4;
        }
      });
    }

    // Dynamic lens core light pulse
    if (coreLightRef.current) {
      coreLightRef.current.intensity = currentGlow * 2.4;
    }
  });

  return (
    <group ref={cameraGroupRef}>
      {/* 
        Centering offset: bounding box center of dslr_camera.glb is [1.11, 0.02, 0].
        Applying [-1.11, -0.02, 0] centers the camera rotation axis perfectly.
      */}
      <group ref={innerModelRef} position={[-1.11, -0.02, 0]} scale={0.46}>
        {/* Authentic DSLR Camera Model */}
        <primitive object={clonedScene} />

        {/* 
          Internal Mechanical Aperture Iris Assembly
          Positioned inside the lens barrel at native coordinates [1.94, -0.56, 0]
          Rotated to face along the optical X axis
        */}
        <group position={[1.94, -0.56, 0]} rotation={[0, Math.PI / 2, 0]}>
          {apertureBlades.map((b, i) => (
            <group key={b.id} rotation={[0, 0, b.angle]}>
              <mesh
                ref={(el) => (irisBladesRef.current[i] = el)}
                position={[0.34, 0, 0]}
                geometry={b.geometry}
                material={b.material}
              />
            </group>
          ))}
        </group>

        {/* 
          Warm Optical Core Emitter & Lens Projection Flare
          Positioned right at the front center of the lens [3.15, -0.56, 0]
        */}
        <group position={[3.15, -0.56, 0]}>
          {/* Core Point Light */}
          <pointLight
            ref={coreLightRef}
            color="#FFA500"
            intensity={lensGlowIntensity * 2.4}
            distance={9}
          />

          {/* Optical Core Emitter Disc */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.55, 32]} />
            <meshBasicMaterial
              color="#FFA500"
              transparent
              opacity={0.88}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Soft Amber Glow Halo Ring */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0.02, 0, 0]}>
            <ringGeometry args={[0.55, 0.72, 32]} />
            <meshBasicMaterial
              color="#FF8C00"
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* 
        3D Human Supporting Hand
        Positioned naturally beneath the DSLR camera body cradling the underside
      */}
      {showHand && (
        <SupportingHand
          position={[0.22, -0.92, -0.05]}
          rotation={[0.38, -0.52, 0.28]}
          scale={12.5}
          reducedMotion={reducedMotion}
        />
      )}
    </group>
  );
}

useGLTF.preload('/dslr_camera.glb');
