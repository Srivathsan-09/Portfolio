import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Human Hand supporting the DSLR camera from beneath
 * Loaded from rigged anatomical GLB model with custom photorealistic skin PBR material.
 */
export default function SupportingHand({
  position = [0.45, -1.55, 0.15],
  rotation = [0.25, -0.65, 0.35],
  scale = 13.5,
  reducedMotion = false,
}) {
  const handGroupRef = useRef();
  const { scene } = useGLTF('/r_hand.glb');

  // Clone scene and apply premium studio photographer skin material
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Photorealistic human skin material with subtle subsurface warmth and softness
    const skinMaterial = new THREE.MeshPhysicalMaterial({
      color: '#a87556',
      roughness: 0.65,
      metalness: 0.04,
      clearcoat: 0.15,
      clearcoatRoughness: 0.45,
      reflectivity: 0.35,
      sheen: 0.6,
      sheenColor: new THREE.Color('#d49b78'),
      sheenRoughness: 0.35,
    });

    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = skinMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  // Subtle breathing float synchronized with the camera
  useFrame((state) => {
    if (!handGroupRef.current || reducedMotion) return;
    const time = state.clock.getElapsedTime();
    handGroupRef.current.position.y = position[1] + Math.sin(time * 0.9) * 0.035;
    handGroupRef.current.rotation.z = rotation[2] + Math.sin(time * 0.7) * 0.015;
  });

  return (
    <group ref={handGroupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload('/r_hand.glb');
