import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RealisticDSLRCamera from './RealisticDSLRCamera';
import EmergingCard from './EmergingCard';

gsap.registerPlugin(ScrollTrigger);

/**
 * Floating Studio Particles for atmospheric depth and lighting
 */
function StudioParticles({ count = 100 }) {
  const pointsRef = useRef();
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FFB02E"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Interactive 3D Camera & Emerging Photograph Cards Scene Content
 */
function SceneContent({
  collections,
  openGalleryModal,
  isMobile,
  isTablet,
  reducedMotion,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeCardClick, setActiveCardClick] = useState(null);
  const [assemblyProgress, setAssemblyProgress] = useState(reducedMotion ? 1.0 : 0.0);
  const [apertureOpen, setApertureOpen] = useState(reducedMotion ? 1.0 : 0.1);
  const [lensGlowIntensity, setLensGlowIntensity] = useState(2.0);
  const [hasEmerged, setHasEmerged] = useState(false);

  // Dynamic Camera & Card layout coordinates shifted gracefully towards right
  const cameraPos = useMemo(() => (
    isMobile
      ? [0, 1.45, 0]
      : isTablet
      ? [0.45, 0, 0]
      : [0.72, 0, 0]
  ), [isMobile, isTablet]);

  // Camera scale: large, prominent centerpiece
  const cameraScale = isMobile ? 0.98 : isTablet ? 1.18 : 1.38;

  // Final 3D composition coordinates for the 4 collections around the camera
  // Symmetrically framing the camera with generous negative space
  const targetCoordinates = useMemo(() => (
    isMobile
      ? [
          { pos: [-1.08, -0.48, 0.35], rot: [0.05, 0.10, -0.02] },
          { pos: [1.08, -0.48, 0.35], rot: [0.05, -0.10, 0.02] },
          { pos: [-1.08, -2.15, 0.50], rot: [-0.04, 0.10, -0.02] },
          { pos: [1.08, -2.15, 0.50], rot: [-0.04, -0.10, 0.02] },
        ]
      : isTablet
      ? [
          { pos: [-1.95, 1.25, 0.45], rot: [0.05, 0.20, -0.03] },
          { pos: [-2.02, -1.25, 0.35], rot: [-0.04, 0.22, 0.03] },
          { pos: [2.85, 1.20, 0.40], rot: [0.05, -0.20, 0.03] },
          { pos: [2.90, -1.25, 0.45], rot: [-0.05, -0.20, -0.03] },
        ]
      : [
          // Desktop balanced composition framing the DSLR shifted to center-right
          { pos: [-1.95, 1.32, 0.50], rot: [0.05, 0.24, -0.03] },  // Top-Left: PORTRAITS
          { pos: [-2.05, -1.35, 0.40], rot: [-0.04, 0.26, 0.03] }, // Bottom-Left: NATURE
          { pos: [3.45, 1.30, 0.45], rot: [0.05, -0.24, 0.03] },   // Top-Right: ARCHITECTURE
          { pos: [3.55, -1.35, 0.55], rot: [-0.05, -0.24, -0.03] }, // Bottom-Right: MOMENTS
        ]
  ), [isMobile, isTablet]);

  // Animated positions of the 4 cards during the emergence timeline
  const [cardTransforms, setCardTransforms] = useState(() =>
    collections.map(() => ({
      pos: [cameraPos[0], cameraPos[1], cameraPos[2] + 3.25],
      scale: 0.001,
      opacity: 0,
    }))
  );

  // GSAP Choreographed Mechanical Assembly & Emergence Timeline
  useEffect(() => {
    if (reducedMotion) {
      setAssemblyProgress(1.0);
      setApertureOpen(1.0);
      setHasEmerged(true);
      return;
    }

    const origin = [cameraPos[0], cameraPos[1], cameraPos[2] + 3.25];
    const triggerEl = document.getElementById('work');

    const tl = gsap.timeline({
      paused: Boolean(triggerEl),
      delay: 0.2,
      onComplete: () => {
        setHasEmerged(true);
      },
    });

    const animProxy = {
      assembly: 0.0,
      aperture: 0.1,
      glow: 2.0,
    };

    // 1. Mechanical Assembly: Components slide together and lock with rotational precision
    tl.to(
      animProxy,
      {
        assembly: 1.0,
        duration: 1.45,
        ease: 'power3.inOut',
        onUpdate: () => setAssemblyProgress(animProxy.assembly),
      },
      0
    );

    // 2. Aperture Iris Mechanical Opening
    tl.to(
      animProxy,
      {
        aperture: 1.0,
        duration: 0.6,
        ease: 'back.out(1.8)',
        onUpdate: () => setApertureOpen(animProxy.aperture),
      },
      1.15
    );

    // 3. Warm Amber Light Flare Surge
    tl.to(
      animProxy,
      {
        glow: 6.5,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => setLensGlowIntensity(animProxy.glow),
      },
      1.3
    );
    tl.to(
      animProxy,
      {
        glow: 2.5,
        duration: 0.65,
        ease: 'power2.inOut',
        onUpdate: () => setLensGlowIntensity(animProxy.glow),
      },
      1.75
    );

    // 4. Staggered emergence of photographs from the assembled lens
    collections.forEach((_, idx) => {
      const target = targetCoordinates[idx];
      const proxy = {
        x: origin[0],
        y: origin[1],
        z: origin[2],
        scale: 0.001,
      };

      tl.to(
        proxy,
        {
          x: target.pos[0],
          y: target.pos[1],
          z: target.pos[2],
          scale: 1.0,
          duration: 1.35,
          ease: 'power3.out',
          onUpdate: () => {
            setCardTransforms((prev) => {
              const next = [...prev];
              next[idx] = {
                pos: [proxy.x, proxy.y, proxy.z],
                scale: proxy.scale,
                opacity: 1,
              };
              return next;
            });
          },
        },
        1.65 + idx * 0.28
      );
    });

    let st;
    if (triggerEl) {
      st = ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top 75%',
        once: true,
        onEnter: () => tl.play(),
      });
    } else {
      tl.play();
    }

    return () => {
      st?.kill();
      tl.kill();
    };
  }, [cameraPos, collections, reducedMotion, targetCoordinates]);

  // Handle cinematic card selection transition into gallery
  const handleCardClick = (categoryTitle, idx) => {
    setActiveCardClick(idx);
    // Smooth foreground zoom transition before activating modal
    setTimeout(() => {
      openGalleryModal(categoryTitle);
      setTimeout(() => setActiveCardClick(null), 450);
    }, 350);
  };

  return (
    <>
      {/* =========================================================================
          CINEMATIC STUDIO LIGHTING
         ========================================================================= */}
      {/* Ambient Fill */}
      <ambientLight intensity={1.05} />

      {/* Primary Warm Front Key Light */}
      <directionalLight
        position={[-3, 4, 6]}
        intensity={2.6}
        color="#FFF5E5"
        castShadow
      />

      {/* Front-Right Camera Body Fill Light */}
      <directionalLight
        position={[3.5, 2.5, 5]}
        intensity={1.9}
        color="#FFECD2"
      />

      {/* Signature Amber / Orange Studio Rim Backlight */}
      <directionalLight
        position={[4, -2, -3]}
        intensity={4.5}
        color="#FF9800"
      />

      {/* Top Rim Specular Light */}
      <spotLight
        position={[0, 6, 2.5]}
        intensity={3.2}
        angle={0.65}
        penumbra={0.7}
        color="#FFE4B5"
      />

      {/* Front Optical Lens Specular Glint Light */}
      <pointLight
        position={[cameraPos[0], cameraPos[1] + 1.2, cameraPos[2] + 4.2]}
        intensity={1.8}
        distance={6}
        color="#FFFFFF"
      />

      {/* Deep Blue Fill on Shadow Side */}
      <directionalLight
        position={[-5, -4, 2]}
        intensity={0.8}
        color="#202b3d"
      />

      {/* Floating Ambient Dust Particles */}
      <StudioParticles count={isMobile ? 50 : 110} />

      {/* =========================================================================
          CENTRAL REALISTIC 3D DSLR CAMERA WITH ASSEMBLE ANIMATION & HAND
         ========================================================================= */}
      <group position={cameraPos} scale={cameraScale}>
        <RealisticDSLRCamera
          assemblyProgress={assemblyProgress}
          apertureOpen={apertureOpen}
          lensGlowIntensity={lensGlowIntensity}
          reducedMotion={reducedMotion}
          showHand={true}
        />
      </group>

      {/* =========================================================================
          FOUR PHOTOGRAPHY COLLECTIONS EMERGING & FLOATING AROUND THE CAMERA
         ========================================================================= */}
      {collections.map((item, idx) => {
        const target = targetCoordinates[idx];
        const currentTransform = cardTransforms[idx] || {
          pos: target.pos,
          scale: 1.0,
        };

        const activePos = hasEmerged ? target.pos : currentTransform.pos;
        const activeScale = hasEmerged ? 1.0 : currentTransform.scale;

        return (
          <group key={item.id} scale={activeScale}>
            <EmergingCard
              item={item}
              index={idx}
              targetPosition={activePos}
              targetRotation={target.rot}
              isOtherHovered={hoveredIdx !== null && hoveredIdx !== idx}
              isSelected={activeCardClick === idx}
              isOtherSelected={activeCardClick !== null && activeCardClick !== idx}
              onHover={(i) => setHoveredIdx(i)}
              onUnhover={() => setHoveredIdx(null)}
              onClick={() => handleCardClick(item.title, idx)}
              reducedMotion={reducedMotion}
            />
          </group>
        );
      })}
    </>
  );
}

/**
 * Main 3D Canvas Container
 */
export default function CameraScene({ collections, openGalleryModal }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);

    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  return (
    <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[750px] xl:h-[790px] select-none">
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 8.4 : isTablet ? 8.6 : 8.8],
          fov: isMobile ? 54 : isTablet ? 48 : 46,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.75]}
        className="w-full h-full"
      >
        <SceneContent
          collections={collections}
          openGalleryModal={openGalleryModal}
          isMobile={isMobile}
          isTablet={isTablet}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
