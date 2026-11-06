import React, { useRef, useState, useEffect, useMemo, forwardRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AboutContent from './AboutContent';

gsap.registerPlugin(ScrollTrigger);

/**
 * Deterministic pseudo-random generator for 100% reversible flight math
 */
function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * AboutDisintegration Component
 *
 * Implements a premium, scroll-controlled 3D box disintegration transition:
 * - Divides the About page into a grid of 3D rectangular tiles/boxes.
 * - As the user scrolls down towards WORK, the tiles separate, lift off, tumble
 *   in 3D perspective space with realistic depth and amber seam glows, and fly away.
 * - Directly scrubbed by GSAP ScrollTrigger (continuous, reversible, slow/fast responsive).
 * - Reveals the WORK section underneath.
 * - Fully reversible: scrolling UP reconstructs the complete About page.
 */
const AboutDisintegration = forwardRef(function AboutDisintegration(
  {
    scrollToSection,
    _isLayer = false,
    tagRef,
    headingRef,
    textRef,
    quoteRef,
    ctaRef,
    bgWrapperRef,
  },
  _ref
) {
  const containerRef = useRef(null);
  const intactWrapperRef = useRef(null);
  const tilesGridRef = useRef(null);
  const tileRefs = useRef([]);

  // Responsive grid layout: 70 tiles on desktop (10x7), 48 on tablet (8x6), 36 on mobile (6x6)
  const [gridConfig, setGridConfig] = useState(() => {
    if (typeof window === 'undefined') return { cols: 10, rows: 7 };
    const w = window.innerWidth;
    if (w < 768) return { cols: 6, rows: 6 };
    if (w < 1024) return { cols: 8, rows: 6 };
    return { cols: 10, rows: 7 };
  });

  // Track responsive screen resizes
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const nextConfig =
        w < 768
          ? { cols: 6, rows: 6 }
          : w < 1024
          ? { cols: 8, rows: 6 }
          : { cols: 10, rows: 7 };

      setGridConfig((prev) => {
        if (prev.cols === nextConfig.cols && prev.rows === nextConfig.rows) return prev;
        return nextConfig;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalTiles = gridConfig.cols * gridConfig.rows;

  // Pre-calculate deterministic 3D flight trajectories for each tile
  const tileTrajectories = useMemo(() => {
    const { cols, rows } = gridConfig;
    const trajectories = [];

    for (let i = 0; i < totalTiles; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Normalized coordinates from center: [-1, 1]
      const nx = cols > 1 ? (col - (cols - 1) / 2) / ((cols - 1) / 2) : 0;
      const ny = rows > 1 ? (row - (rows - 1) / 2) / ((rows - 1) / 2) : 0;
      const dist = Math.sqrt(nx * nx + ny * ny);

      const r1 = pseudoRandom(i + 1);
      const r2 = pseudoRandom(i * 3 + 7);
      const r3 = pseudoRandom(i * 5 + 13);
      const r4 = pseudoRandom(i * 7 + 29);

      // 3D scatter translations
      const x = nx * (320 + r1 * 260) + (r2 - 0.5) * 140;
      const y = ny * (280 + r3 * 220) + (r4 - 0.5) * 140;

      // Z depth: center tiles explode forward towards camera (+Z up to 680px)
      const zFactor = Math.max(0, 1.3 - dist * 0.55);
      const z = zFactor * (450 + r1 * 280) + (r3 - 0.5) * 160;

      // 3D compound rotations in degrees
      const rotX = ny * 32 + (r2 - 0.5) * 45;
      const rotY = -nx * 38 + (r4 - 0.5) * 45;
      const rotZ = (r1 - 0.5) * 35;

      // Subtle scale variation
      const scale = 0.72 + r3 * 0.28;

      // Stagger timing within timeline
      const delay = dist * 0.16 + r2 * 0.1;

      trajectories.push({
        col,
        row,
        x,
        y,
        z,
        rotX,
        rotY,
        rotZ,
        scale,
        delay,
      });
    }

    return trajectories;
  }, [gridConfig, totalTiles]);

  // Construct GSAP ScrollTrigger Scrubbed Disintegration Timeline
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      if (tilesGridRef.current) tilesGridRef.current.style.display = 'none';
      if (intactWrapperRef.current) intactWrapperRef.current.style.display = 'block';
      return;
    }

    // Reset tile elements and will-change optimization
    const validTileEls = tileRefs.current.filter(Boolean);

    gsap.set(validTileEls, {
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      opacity: 1,
      transformStyle: 'preserve-3d',
      willChange: 'transform, opacity',
    });

    if (tilesGridRef.current) {
      gsap.set(tilesGridRef.current, { opacity: 0, pointerEvents: 'none' });
    }
    if (intactWrapperRef.current) {
      gsap.set(intactWrapperRef.current, { opacity: 1, pointerEvents: 'auto' });
    }

    // Master ScrollTrigger Scrub Timeline
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=100%', // 100vh of scrub distance
        pin: true,
        pinSpacing: false, // Allows WORK section underneath to be revealed
        scrub: 0.8, // Smooth spring inertia for mouse wheel, trackpad, and touch
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Seamless transition between intact interactive page and 3D tiles
          if (p <= 0.005) {
            if (intactWrapperRef.current) {
              intactWrapperRef.current.style.opacity = '1';
              intactWrapperRef.current.style.pointerEvents = 'auto';
            }
            if (tilesGridRef.current) {
              tilesGridRef.current.style.opacity = '0';
              tilesGridRef.current.style.pointerEvents = 'none';
            }
          } else {
            if (intactWrapperRef.current) {
              intactWrapperRef.current.style.opacity = '0';
              intactWrapperRef.current.style.pointerEvents = 'none';
            }
            if (tilesGridRef.current) {
              tilesGridRef.current.style.opacity = '1';
              tilesGridRef.current.style.pointerEvents = 'none';
            }
          }

          // Pass pointer events to Work when fully transitioned
          if (p >= 0.99) {
            container.style.pointerEvents = 'none';
          } else {
            container.style.pointerEvents = 'auto';
          }

          // Performance: free GPU composite layers when fully past or at top
          if (p >= 0.99 || p <= 0.005) {
            validTileEls.forEach((el) => {
              if (el) el.style.willChange = 'auto';
            });
          } else {
            validTileEls.forEach((el) => {
              if (el) el.style.willChange = 'transform, opacity';
            });
          }
        },
      },
    });

    // Animate each tile along its 3D flight trajectory
    validTileEls.forEach((tileEl, idx) => {
      const traj = tileTrajectories[idx];
      if (!tileEl || !traj) return;

      const startTime = traj.delay * 0.45;
      const duration = 0.85;

      // 1. Initial fracture lift and subtle amber seam glow
      tl.to(
        tileEl,
        {
          z: 25,
          scale: 1.02,
          duration: 0.18,
          ease: 'power1.out',
        },
        startTime
      );

      // 2. 3D detachment, rotation, and flight outwards
      tl.to(
        tileEl,
        {
          x: traj.x,
          y: traj.y,
          z: traj.z,
          rotationX: traj.rotX,
          rotationY: traj.rotY,
          rotationZ: traj.rotZ,
          scale: traj.scale,
          duration: duration,
          ease: 'power2.out',
        },
        startTime + 0.1
      );

      // 3. Gradual fade out as tiles disperse out of the viewport
      tl.to(
        tileEl,
        {
          opacity: 0,
          duration: 0.38,
          ease: 'power1.in',
        },
        startTime + duration - 0.28
      );
    });

    // Refresh ScrollTrigger to ensure exact geometry
    ScrollTrigger.refresh();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [tileTrajectories, totalTiles]);

  const { cols, rows } = gridConfig;

  return (
    <div
      ref={containerRef}
      id="about"
      className="relative w-full min-h-screen overflow-hidden bg-[#080808] z-20"
      style={{
        perspective: '1300px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 
        UNDERNEATH WORK REVEAL BACKDROP
        Displays the deep cinematic studio atmosphere with warm amber glow behind the disintegrating tiles
      */}
      <div className="absolute inset-0 w-full h-full bg-[#080808] pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF9800]/10 rounded-full blur-[180px] pointer-events-none" />
      </div>

      {/* 
        1. INTACT ABOUT PAGE (Progress = 0)
        Fully interactive with original portrait, typography, quote block, and buttons
      */}
      <div
        ref={intactWrapperRef}
        className="relative w-full h-full z-10"
        style={{
          transition: 'opacity 0.1s linear',
        }}
      >
        <AboutContent
          scrollToSection={scrollToSection}
          isInteractive={true}
          tagRef={tagRef}
          headingRef={headingRef}
          textRef={textRef}
          quoteRef={quoteRef}
          ctaRef={ctaRef}
          bgWrapperRef={bgWrapperRef}
        />
      </div>

      {/* 
        2. 3D BOX DISINTEGRATION GRID (Progress > 0)
        Divides the About page into a grid of 3D rectangular tiles that detach, rotate,
        and fly away in 3D perspective space
      */}
      <div
        ref={tilesGridRef}
        className="absolute inset-0 w-full h-full z-20 pointer-events-none select-none overflow-hidden"
        style={{
          perspective: '1300px',
          perspectiveOrigin: '50% 50%',
          transformStyle: 'preserve-3d',
        }}
      >
        {tileTrajectories.map((tile, idx) => {
          const colWidth = 100 / cols;
          const rowHeight = 100 / rows;

          const leftPercent = tile.col * colWidth;
          const topPercent = tile.row * rowHeight;

          return (
            <div
              key={idx}
              ref={(el) => (tileRefs.current[idx] = el)}
              className="absolute overflow-hidden rounded-[2px]"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${colWidth}%`,
                height: `${rowHeight}%`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                // Subtle amber fracture seam and physical depth shadow
                boxShadow:
                  '0 0 0 1px rgba(255, 152, 0, 0.22), 0 12px 28px rgba(0, 0, 0, 0.75)',
              }}
            >
              {/* 
                Inner content sized to 100% of the entire section and offset inversely,
                producing a 100% pixel-perfect slice of the About page
              */}
              <div
                className="absolute pointer-events-none select-none"
                style={{
                  left: `-${tile.col * 100}%`,
                  top: `-${tile.row * 100}%`,
                  width: `${cols * 100}%`,
                  height: `${rows * 100}%`,
                }}
              >
                <AboutContent
                  scrollToSection={scrollToSection}
                  isInteractive={false}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default AboutDisintegration;
