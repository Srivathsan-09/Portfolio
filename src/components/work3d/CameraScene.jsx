import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RealisticDSLRCamera from './RealisticDSLRCamera';
import EmergingCard from './EmergingCard';

gsap.registerPlugin(ScrollTrigger);

/**
 * Optimized Floating Studio Particles for atmospheric depth
 * Scales count dynamically for mobile devices to reduce vertex buffer overhead
 */
function StudioParticles({ count = 75, isMobile = false }) {
  const pointsRef = useRef();
  const actualCount = isMobile ? 24 : count;

  const positions = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    for (let i = 0; i < actualCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [actualCount]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={actualCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FFB02E"
        transparent
        opacity={0.5}
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

  // Lens emergence origin in world coordinates (calculated at front of DSLR lens)
  const lensOrigin = useMemo(() => [
    cameraPos[0] + 0.22,
    cameraPos[1] - 0.35,
    cameraPos[2] + 1.35,
  ], [cameraPos]);

  // Final 3D composition coordinates for the 4 collections around the camera
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
          { pos: [-1.95, 1.32, 0.50], rot: [0.05, 0.24, -0.03] },  // Top-Left: PORTRAITS
          { pos: [-2.05, -1.35, 0.40], rot: [-0.04, 0.26, 0.03] }, // Bottom-Left: NATURE
          { pos: [3.45, 1.30, 0.45], rot: [0.05, -0.24, 0.03] },   // Top-Right: ARCHITECTURE
          { pos: [3.55, -1.35, 0.55], rot: [-0.05, -0.24, -0.03] }, // Bottom-Right: MOMENTS
        ]
  ), [isMobile, isTablet]);

  // Animated positions of the 4 cards during the emergence timeline
  const [cardTransforms, setCardTransforms] = useState(() =>
    collections.map(() => ({
      pos: lensOrigin,
      scale: 0.001,
      opacity: 0,
    }))
  );

  // GSAP Choreographed Mechanical Assembly & Emergence Timeline (Optimized timings)
  useEffect(() => {
    if (reducedMotion) {
      setAssemblyProgress(1.0);
      setApertureOpen(1.0);
      setHasEmerged(true);
      return;
    }

    const triggerEl = document.getElementById('work');

    const tl = gsap.timeline({
      paused: Boolean(triggerEl),
      delay: 0.1,
      onComplete: () => {
        setHasEmerged(true);
      },
    });

    const animProxy = {
      assembly: 0.0,
      aperture: 0.1,
      glow: 2.0,
    };

    // 1. Mechanical Assembly: Components slide together smoothly
    tl.to(
      animProxy,
      {
        assembly: 1.0,
        duration: 1.1,
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
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => setApertureOpen(animProxy.aperture),
      },
      0.85
    );

    // 3. Warm Amber Light Flare Surge
    tl.to(
      animProxy,
      {
        glow: 5.5,
        duration: 0.35,
        ease: 'power2.out',
        onUpdate: () => setLensGlowIntensity(animProxy.glow),
      },
      0.95
    );
    tl.to(
      animProxy,
      {
        glow: 2.5,
        duration: 0.45,
        ease: 'power2.inOut',
        onUpdate: () => setLensGlowIntensity(animProxy.glow),
      },
      1.3
    );

    // 4. Staggered emergence of photographs from the assembled lens
    collections.forEach((_, idx) => {
      const target = targetCoordinates[idx];
      const proxy = {
        x: lensOrigin[0],
        y: lensOrigin[1],
        z: lensOrigin[2],
        scale: 0.001,
      };

      tl.to(
        proxy,
        {
          x: target.pos[0],
          y: target.pos[1],
          z: target.pos[2],
          scale: 1.0,
          duration: 1.05,
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
        1.15 + idx * 0.18
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
  }, [cameraPos, collections, lensOrigin, reducedMotion, targetCoordinates]);

  // Handle cinematic card selection transition into gallery
  const handleCardClick = (categoryTitle, idx) => {
    setActiveCardClick(idx);
    setTimeout(() => {
      openGalleryModal(categoryTitle);
      setTimeout(() => setActiveCardClick(null), 300);
    }, 250);
  };

  return (
    <>
      {/* Cinematic Studio Lighting */}
      <ambientLight intensity={1.1} />

      <directionalLight
        position={[-3, 4, 6]}
        intensity={2.6}
        color="#FFF5E5"
      />

      <directionalLight
        position={[3.5, 2.5, 5]}
        intensity={1.8}
        color="#FFECD2"
      />

      <directionalLight
        position={[4, -2, -3]}
        intensity={4.5}
        color="#FF9800"
      />

      {/* Optimized Ambient Dust Particles */}
      <StudioParticles isMobile={isMobile} />

      {/* Central DSLR Camera */}
      <group position={cameraPos} scale={cameraScale}>
        <RealisticDSLRCamera
          assemblyProgress={assemblyProgress}
          apertureOpen={apertureOpen}
          lensGlowIntensity={lensGlowIntensity}
          reducedMotion={reducedMotion}
          showHand={true}
        />
      </group>

      {/* Four Photography Collections Floating Cards */}
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
 * Uses demand-based rendering when off-screen to preserve 100% GPU/CPU
 */
export default function CameraScene({ collections, openGalleryModal }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isSectionInView, setIsSectionInView] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive, { passive: true });

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);

    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  // Demand-based rendering observer: Pauses Three.js render loop when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: '100px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] sm:h-[680px] lg:h-[750px] xl:h-[790px] select-none"
    >
      <Canvas
        frameloop={isSectionInView ? 'always' : 'demand'}
        camera={{
          position: [0, 0, isMobile ? 8.4 : isTablet ? 8.6 : 8.8],
          fov: isMobile ? 54 : isTablet ? 48 : 46,
        }}
        gl={{
          antialias: !isMobile, // Disable expensive MSAA on mobile for 2x performance
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, isMobile ? 1.2 : 1.5]}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <SceneContent
            collections={collections}
            openGalleryModal={openGalleryModal}
            isMobile={isMobile}
            isTablet={isTablet}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
