import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RealisticDSLRCamera from './RealisticDSLRCamera';
import EmergingCard from './EmergingCard';

gsap.registerPlugin(ScrollTrigger);

/**
 * Floating Studio Particles for depth and atmosphere
 */
function StudioParticles({ count = 100 }) {
  const pointsRef = useRef();
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    return pos;
  });

  useEffect(() => {
    // Keep reference clean
  }, []);

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
  const [lensGlowIntensity, setLensGlowIntensity] = useState(2.0);
  const [hasEmerged, setHasEmerged] = useState(false);

  // Dynamic Camera & Card layout coordinates based on breakpoint
  const cameraPos = isMobile
    ? [0, 1.45, 0]
    : [0, 0, 0];

  const cameraScale = isMobile ? 0.72 : isTablet ? 0.85 : 1.0;

  // Final 3D composition coordinates for the 4 collections around the camera
  const targetCoordinates = isMobile
    ? [
        // Mobile 2x2 grid below the camera
        { pos: [-1.12, -0.42, 0.4], rot: [0.06, 0.12, -0.02] },
        { pos: [1.12, -0.42, 0.4], rot: [0.06, -0.12, 0.02] },
        { pos: [-1.12, -2.18, 0.6], rot: [-0.04, 0.12, -0.02] },
        { pos: [1.12, -2.18, 0.6], rot: [-0.04, -0.12, 0.02] },
      ]
    : isTablet
    ? [
        { pos: [-1.95, 1.25, 0.7], rot: [0.06, 0.2, -0.04] },
        { pos: [-2.05, -1.25, 0.5], rot: [-0.05, 0.22, 0.04] },
        { pos: [1.95, 1.2, 0.5], rot: [0.05, -0.2, 0.03] },
        { pos: [2.05, -1.25, 0.6], rot: [-0.06, -0.18, -0.04] },
      ]
    : [
        // Desktop balanced composition framing the central DSLR
        { pos: [-2.15, 1.25, 0.8], rot: [0.06, 0.22, -0.04] },  // Top-Left: PORTRAITS
        { pos: [-2.25, -1.28, 0.65], rot: [-0.05, 0.25, 0.04] }, // Bottom-Left: NATURE
        { pos: [2.15, 1.22, 0.6], rot: [0.05, -0.22, 0.03] },   // Top-Right: ARCHITECTURE
        { pos: [2.22, -1.3, 0.75], rot: [-0.06, -0.18, -0.04] }, // Bottom-Right: MOMENTS
      ];

  // Animated positions of the 4 cards during the emergence timeline
  const [cardTransforms, setCardTransforms] = useState(() =>
    collections.map(() => ({
      pos: [cameraPos[0], cameraPos[1], cameraPos[2] + 2.35],
      scale: 0.001,
      opacity: 0,
    }))
  );

  // GSAP Choreographed Emergence Timeline: Photographs emerge physically from lens!
  useEffect(() => {
    if (reducedMotion) {
      setHasEmerged(true);
      return;
    }

    // Origin point: The front center of the camera lens barrel
    const origin = [cameraPos[0], cameraPos[1], cameraPos[2] + 2.35];
    const triggerEl = document.getElementById('work');

    const tl = gsap.timeline({
      paused: Boolean(triggerEl),
      delay: 0.25,
      onStart: () => {
        // Lens illuminates with bright warm amber projection flare
        gsap.to({ val: 2.0 }, {
          val: 6.0,
          duration: 0.65,
          ease: 'power2.out',
          onUpdate: function () {
            setLensGlowIntensity(this.targets()[0].val);
          },
          yoyo: true,
          repeat: 1,
        });
      },
      onComplete: () => {
        setHasEmerged(true);
      },
    });

    // Staggered emergence of each photograph out of the lens
    collections.forEach((_, idx) => {
      const target = targetCoordinates[idx];
      const proxy = {
        x: origin[0],
        y: origin[1],
        z: origin[2],
        scale: 0.001,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
      };

      tl.to(
        proxy,
        {
          x: target.pos[0],
          y: target.pos[1],
          z: target.pos[2],
          scale: 1.0,
          rotX: target.rot[0],
          rotY: target.rot[1],
          rotZ: target.rot[2],
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
        idx * 0.28 // Smooth organic stagger
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
  }, [isMobile, isTablet, reducedMotion]);

  return (
    <>
      {/* =========================================================================
          CINEMATIC STUDIO LIGHTING
         ========================================================================= */}
      {/* Ambient Fill */}
      <ambientLight intensity={0.8} />

      {/* Warm Front Key Light */}
      <directionalLight
        position={[-3, 4, 6]}
        intensity={2.2}
        color="#FFF6E8"
        castShadow
      />

      {/* Signature Amber / Orange Studio Rim Backlight */}
      <directionalLight
        position={[4, -2, -3]}
        intensity={3.8}
        color="#FF9800"
      />

      {/* Top Rim Specular Light */}
      <spotLight
        position={[0, 6, 2]}
        intensity={2.5}
        angle={0.6}
        penumbra={0.8}
        color="#FFE0B2"
      />

      {/* Deep Blue Fill on Shadow Side */}
      <directionalLight
        position={[-5, -4, 2]}
        intensity={0.6}
        color="#152238"
      />

      {/* Floating Ambient Dust Particles */}
      <StudioParticles count={isMobile ? 50 : 110} />

      {/* =========================================================================
          CENTRAL REALISTIC 3D DSLR CAMERA
         ========================================================================= */}
      <group position={cameraPos} scale={cameraScale}>
        <RealisticDSLRCamera
          lensGlowIntensity={lensGlowIntensity}
          reducedMotion={reducedMotion}
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
              onHover={(i) => setHoveredIdx(i)}
              onUnhover={() => setHoveredIdx(null)}
              onClick={openGalleryModal}
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
    <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[740px] xl:h-[780px] select-none">
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 8.2 : isTablet ? 8.4 : 8.2],
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
