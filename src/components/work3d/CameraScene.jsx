import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
 * Scroll-scrubbed emergence:
 * - Scrolling DOWN: lens mechanically assembles, aperture opens with amber flare,
 *   and photographs emerge from the lens glass out to the 4 floating corners.
 * - Scrolling UP: photographs reverse trajectory back into the camera lens and shrink to 0.
 * - 100% direct Three.js scene-graph updates via useFrame and refs for 60/120 FPS performance.
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
  const [isEmerged, setIsEmerged] = useState(reducedMotion);
  const isEmergedRef = useRef(reducedMotion);

  // Dynamic Camera & Card layout coordinates: centered on mobile, right-aligned on desktop
  const cameraPos = useMemo(() => (
    isMobile
      ? [0, 0, 0]
      : isTablet
      ? [0.45, 0, 0]
      : [0.72, 0, 0]
  ), [isMobile, isTablet]);

  // Camera scale: large, prominent centerpiece
  const cameraScale = isMobile ? 0.90 : isTablet ? 1.18 : 1.38;

  // Lens emergence origin in world coordinates (front of DSLR lens barrel)
  const lensOrigin = useMemo(() => [
    cameraPos[0] + 0.22,
    cameraPos[1] - 0.35,
    cameraPos[2] + 1.35,
  ], [cameraPos]);

  // Scalable, neat 3D composition coordinates for any number of collections around the camera
  const targetCoordinates = useMemo(() => {
    const total = collections.length;
    return collections.map((_, idx) => {
      if (isMobile) {
        // Mobile layout: Top 2 cards above camera, Bottom 2 cards below camera.
        // Scalable for any number of cards: distributes evenly into top and bottom pairs.
        const half = Math.ceil(total / 2);
        const isTop = idx < half;
        const subIdx = isTop ? idx : idx - half;
        const col = subIdx % 2; // 0 = left, 1 = right
        const row = Math.floor(subIdx / 2);

        const x = col === 0 ? -1.16 : 1.16;
        const yBase = 1.62 + row * 1.55;
        const y = isTop ? yBase : -yBase;
        const z = 0.40;

        const rotX = isTop ? 0.06 : -0.05;
        const rotY = col === 0 ? 0.13 : -0.13;
        const rotZ = col === 0 ? -0.02 : 0.02;

        return { pos: [x, y, z], rot: [rotX, rotY, rotZ] };
      }

      if (isTablet) {
        const col = idx % 2;
        const isTop = idx < 2;
        return {
          pos: [
            col === 0 ? -1.95 : 2.85,
            isTop ? 1.25 : -1.25,
            0.42,
          ],
          rot: [isTop ? 0.05 : -0.04, col === 0 ? 0.20 : -0.20, col === 0 ? -0.03 : 0.03],
        };
      }

      // Desktop layout: cards framing the central camera symmetrically
      const side = idx % 2 === 0 ? 'left' : 'right';
      const isTop = Math.floor(idx / 2) % 2 === 0;
      const rowOffset = Math.floor(idx / 4) * 0.4;
      const x = side === 'left' ? -2.00 : 3.48;
      const y = (isTop ? 1.32 : -1.35) + (isTop ? rowOffset : -rowOffset);
      const z = 0.48;
      const rotX = isTop ? 0.05 : -0.05;
      const rotY = side === 'left' ? 0.24 : -0.24;
      const rotZ = side === 'left' ? -0.03 : 0.03;

      return { pos: [x, y, z], rot: [rotX, rotY, rotZ] };
    });
  }, [collections, isMobile, isTablet]);

  // Direct animation refs for camera assembly and aperture
  const cameraAnimRef = useRef({
    assembly: reducedMotion ? 1.0 : 0.0,
    aperture: reducedMotion ? 1.0 : 0.1,
    glow: 2.5,
  });

  // Direct animation refs for the 4 floating cards (emergence position & scale)
  const cardsAnimRef = useRef(
    collections.map((_, idx) => ({
      x: reducedMotion ? (targetCoordinates[idx]?.pos[0] ?? lensOrigin[0]) : lensOrigin[0],
      y: reducedMotion ? (targetCoordinates[idx]?.pos[1] ?? lensOrigin[1]) : lensOrigin[1],
      z: reducedMotion ? (targetCoordinates[idx]?.pos[2] ?? lensOrigin[2]) : lensOrigin[2],
      scale: reducedMotion ? 1.0 : 0.001,
    }))
  );

  // References to the outer Three.js groups for direct scene-graph updates
  const cardOuterGroupRefs = useRef([]);

  // Direct 60/120 FPS Three.js transform updates without triggering React re-renders
  useFrame(() => {
    for (let i = 0; i < collections.length; i++) {
      const group = cardOuterGroupRefs.current[i];
      const anim = cardsAnimRef.current[i];
      if (group && anim) {
        group.position.set(anim.x, anim.y, anim.z);
        group.scale.setScalar(anim.scale);
        group.visible = anim.scale > 0.008;
      }
    }
  });

  // ScrollTrigger Bidirectional Scroll Scrubbing Timeline
  useEffect(() => {
    if (reducedMotion) {
      cameraAnimRef.current = { assembly: 1.0, aperture: 1.0, glow: 2.5 };
      collections.forEach((_, idx) => {
        const target = targetCoordinates[idx];
        if (cardsAnimRef.current[idx] && target) {
          cardsAnimRef.current[idx].x = target.pos[0];
          cardsAnimRef.current[idx].y = target.pos[1];
          cardsAnimRef.current[idx].z = target.pos[2];
          cardsAnimRef.current[idx].scale = 1.0;
        }
      });
      setIsEmerged(true);
      isEmergedRef.current = true;
      return;
    }

    const triggerEl = document.getElementById('work');

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        // Toggle isEmerged only when state boundary is crossed to avoid re-renders
        const emerged = cardsAnimRef.current.some((c) => c && c.scale > 0.85);
        if (emerged !== isEmergedRef.current) {
          isEmergedRef.current = emerged;
          setIsEmerged(emerged);
        }
      },
    });

    // Reset initial values at progress 0
    cameraAnimRef.current.assembly = 0.0;
    cameraAnimRef.current.aperture = 0.1;
    cameraAnimRef.current.glow = 2.0;

    // 1. Mechanical Assembly of Camera Lens
    tl.to(
      cameraAnimRef.current,
      {
        assembly: 1.0,
        duration: 0.75,
        ease: 'power2.out',
      },
      0
    );

    // 2. Aperture Iris Mechanical Opening
    tl.to(
      cameraAnimRef.current,
      {
        aperture: 1.0,
        duration: 0.5,
        ease: 'power2.out',
      },
      0.35
    );

    // 3. Warm Optical Flare Flash Surge
    tl.to(
      cameraAnimRef.current,
      {
        glow: 5.5,
        duration: 0.28,
        ease: 'power1.out',
      },
      0.4
    );
    tl.to(
      cameraAnimRef.current,
      {
        glow: 2.5,
        duration: 0.42,
        ease: 'power2.inOut',
      },
      0.68
    );

    // 4. Staggered Emergence of Photos from the Lens Origin to Floating Positions
    collections.forEach((_, idx) => {
      const target = targetCoordinates[idx];
      const anim = cardsAnimRef.current[idx];
      if (!anim || !target) return;

      anim.x = lensOrigin[0];
      anim.y = lensOrigin[1];
      anim.z = lensOrigin[2];
      anim.scale = 0.001;

      const startTime = 0.5 + idx * 0.15;

      tl.to(
        anim,
        {
          x: target.pos[0],
          y: target.pos[1],
          z: target.pos[2],
          scale: 1.0,
          duration: 0.85,
          ease: 'power3.out',
        },
        startTime
      );
    });

    let st;
    if (triggerEl) {
      st = ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top 80%',
        end: 'center 45%',
        scrub: 0.8,
        animation: tl,
        invalidateOnRefresh: true,
      });
    } else {
      tl.play();
    }

    // Refresh ScrollTrigger to calculate exact DOM positions
    ScrollTrigger.refresh();

    return () => {
      st?.kill();
      tl.kill();
    };
  }, [cameraPos, collections, lensOrigin, reducedMotion, targetCoordinates]);

  // Handle cinematic card selection transition into gallery modal
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

      {/* Atmospheric Studio Dust Particles */}
      <StudioParticles isMobile={isMobile} />

      {/* Central DSLR Camera */}
      <group position={cameraPos} scale={cameraScale}>
        <RealisticDSLRCamera
          reducedMotion={reducedMotion}
          showHand={false}
          cameraAnimRef={cameraAnimRef}
        />
      </group>

      {/* Four Photography Collections Floating Cards */}
      {collections.map((item, idx) => {
        const target = targetCoordinates[idx];
        return (
          <group
            key={item.id}
            ref={(el) => (cardOuterGroupRefs.current[idx] = el)}
            position={lensOrigin}
            scale={reducedMotion ? 1.0 : 0.001}
            visible={reducedMotion}
          >
            <EmergingCard
              item={item}
              index={idx}
              targetRotation={target.rot}
              isOtherHovered={hoveredIdx !== null && hoveredIdx !== idx}
              isSelected={activeCardClick === idx}
              isOtherSelected={activeCardClick !== null && activeCardClick !== idx}
              onHover={(i) => setHoveredIdx(i)}
              onUnhover={() => setHoveredIdx(null)}
              onClick={() => handleCardClick(item.title, idx)}
              reducedMotion={reducedMotion}
              isEmerged={isEmerged}
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
      { threshold: 0.05, rootMargin: '300px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[740px] sm:h-[760px] lg:h-[750px] xl:h-[790px] select-none"
    >
      <Canvas
        frameloop={isSectionInView ? 'always' : 'demand'}
        camera={{
          position: [0, 0, isMobile ? 8.9 : isTablet ? 8.6 : 8.8],
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
