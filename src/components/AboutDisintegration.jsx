import React, { useRef, useMemo, useEffect, forwardRef } from 'react';
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
 * Implements a high-performance, 120 FPS 3D box disintegration transition:
 * - Desktop: Divides the About page into 24 crisp 3D tiles.
 *   Uses lightweight, hardware-accelerated CSS-sliced fragments with amber rim highlights
 *   instead of duplicate React trees, completely eliminating layout thrashing and animation lag.
 *   As user scrolls down, the boxes scatter in 3D perspective space while
 *   the WORK section SIMULTANEOUSLY emerges behind them in the same timeline.
 * - Mobile: Completely disabled. Normal, static, natural vertical scroll.
 */
const AboutDisintegration = forwardRef(function AboutDisintegration(
  {
    scrollToSection,
    isMobile = false,
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

  // Desktop grid: 6 columns x 4 rows = 24 tiles (optimal for 120 FPS buttery smooth performance)
  const cols = 6;
  const rows = 4;
  const totalTiles = cols * rows;

  // Pre-calculate deterministic 3D flight trajectories for each tile
  const tileTrajectories = useMemo(() => {
    const trajectories = [];

    for (let i = 0; i < totalTiles; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Normalized coordinates from center: [-1, 1]
      const nx = (col - (cols - 1) / 2) / ((cols - 1) / 2 || 1);
      const ny = (row - (rows - 1) / 2) / ((rows - 1) / 2 || 1);
      const dist = Math.sqrt(nx * nx + ny * ny);

      const r1 = pseudoRandom(i + 1);
      const r2 = pseudoRandom(i * 3 + 7);
      const r3 = pseudoRandom(i * 5 + 13);
      const r4 = pseudoRandom(i * 7 + 29);

      // 3D scatter translations
      const x = nx * (240 + r1 * 180) + (r2 - 0.5) * 100;
      const y = ny * (200 + r3 * 160) + (r4 - 0.5) * 100;

      // Z depth: center tiles explode forward towards camera (+Z up to 500px)
      const zFactor = Math.max(0, 1.3 - dist * 0.55);
      const z = zFactor * (380 + r1 * 220) + (r3 - 0.5) * 120;

      // 3D compound rotations in degrees
      const rotX = ny * 28 + (r2 - 0.5) * 40;
      const rotY = -nx * 34 + (r4 - 0.5) * 40;
      const rotZ = (r1 - 0.5) * 30;

      // Subtle scale variation
      const scale = 0.80 + r3 * 0.20;

      // Stagger timing within timeline
      const delay = dist * 0.15 + r2 * 0.08;

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
  }, [cols, rows, totalTiles]);

  // Construct GSAP ScrollTrigger Scrubbed Disintegration Timeline (Desktop Only)
  useEffect(() => {
    // Mobile or reduced motion: completely disable transitions
    if (isMobile) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const container = containerRef.current;
      if (!container) return;

      const workEl = document.getElementById('work');
      const validTileEls = tileRefs.current.filter(Boolean);

      // Reset tile elements initial state with hardware-accelerated transforms
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
        gsap.set(tilesGridRef.current, { opacity: 0, pointerEvents: 'none', display: 'block' });
      }
      if (intactWrapperRef.current) {
        gsap.set(intactWrapperRef.current, { opacity: 1, pointerEvents: 'auto' });
      }

      // Master Unified ScrollTrigger Scrub Timeline
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=100%', // 100vh of scrub distance
          pin: true,
          scrub: 0.7, // Smooth spring inertia for mouse wheel and trackpad
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Manage pointer events & visibility cleanly without layout thrashing
            if (p >= 0.99) {
              container.style.pointerEvents = 'none';
              if (tilesGridRef.current) tilesGridRef.current.style.visibility = 'hidden';
            } else {
              container.style.pointerEvents = 'auto';
              if (tilesGridRef.current) tilesGridRef.current.style.visibility = 'visible';
            }

            if (intactWrapperRef.current) {
              intactWrapperRef.current.style.pointerEvents = p <= 0.02 ? 'auto' : 'none';
            }
          },
        },
      });

      // 1. INTACT PAGE CROSS-FADE INTO 3D TILES (Driven directly by GSAP scrub timeline)
      if (intactWrapperRef.current) {
        tl.to(
          intactWrapperRef.current,
          {
            opacity: 0,
            duration: 0.08,
            ease: 'power1.out',
          },
          0
        );
      }
      if (tilesGridRef.current) {
        tl.fromTo(
          tilesGridRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.05, ease: 'power1.out' },
          0
        );
      }

      // 2. 3D BOX SCATTER:
      validTileEls.forEach((tileEl, idx) => {
        const traj = tileTrajectories[idx];
        if (!tileEl || !traj) return;

        const startTime = traj.delay * 0.30;
        const duration = 0.85;

        // Initial lift
        tl.to(
          tileEl,
          {
            z: 25,
            scale: 1.02,
            duration: 0.15,
            ease: 'power1.out',
          },
          startTime
        );

        // 3D detachment, rotation, and flight outwards
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
          startTime + 0.08
        );

        // Gradual fade out as tiles disperse
        tl.to(
          tileEl,
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power1.in',
          },
          startTime + duration - 0.28
        );
      });

      ScrollTrigger.refresh();

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        if (workEl) {
          gsap.set(workEl, { clearProps: 'all' });
        }
      };
    });

    return () => mm.revert();
  }, [isMobile, tileTrajectories, totalTiles]);

  // Mobile Render: Normal, static, independent section with ZERO transitions
  if (isMobile) {
    return (
      <section id="about" className="relative w-full min-h-screen bg-[#080808]">
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
      </section>
    );
  }

  // Desktop Render: Pinned 3D box disintegration with transparent backdrop revealing Work
  return (
    <div
      ref={containerRef}
      id="about"
      className="relative w-full min-h-screen overflow-hidden bg-transparent z-20"
      style={{
        perspective: '1300px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 1. INTACT ABOUT PAGE (Progress = 0) */}
      <div
        ref={intactWrapperRef}
        className="relative w-full h-full z-10 will-change-[opacity]"
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

      {/* 2. 3D BOX DISINTEGRATION GRID (High-Performance GPU CSS-Sliced Tiles) */}
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
          const bgPosX = cols > 1 ? (tile.col / (cols - 1)) * 100 : 0;
          const bgPosY = rows > 1 ? (tile.row / (rows - 1)) * 100 : 0;

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
                background: `linear-gradient(135deg, rgba(14, 15, 18, 0.94), rgba(8, 8, 10, 0.98)), url('/images/about.jpg')`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                backgroundBlendMode: 'overlay',
                boxShadow:
                  '0 0 0 1px rgba(255, 152, 0, 0.35), 0 4px 14px rgba(0, 0, 0, 0.7)',
              }}
            >
              {/* Subtle glass reflection highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9800]/12 via-transparent to-white/5 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default AboutDisintegration;
