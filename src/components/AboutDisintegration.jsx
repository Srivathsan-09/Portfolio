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
 * Implements a unified, scroll-controlled 3D box disintegration transition:
 * - Desktop: Divides the About page into 40 3D rectangular tiles/boxes.
 *   As user scrolls down, the boxes scatter in 3D perspective space while
 *   the WORK section SIMULTANEOUSLY emerges behind them in the same timeline.
 *   When the transition finishes, Work is already completely visible and in position.
 * - Mobile: Completely disabled. Zero 3D effects, zero pinning, normal natural vertical scroll.
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

  // Desktop grid: 8 columns x 5 rows = 40 tiles (optimal balance between detail and 120 FPS performance)
  const cols = 8;
  const rows = 5;
  const totalTiles = cols * rows;

  // Pre-calculate deterministic 3D flight trajectories for each tile
  const tileTrajectories = useMemo(() => {
    const trajectories = [];

    for (let i = 0; i < totalTiles; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Normalized coordinates from center: [-1, 1]
      const nx = (col - (cols - 1) / 2) / ((cols - 1) / 2);
      const ny = (row - (rows - 1) / 2) / ((rows - 1) / 2);
      const dist = Math.sqrt(nx * nx + ny * ny);

      const r1 = pseudoRandom(i + 1);
      const r2 = pseudoRandom(i * 3 + 7);
      const r3 = pseudoRandom(i * 5 + 13);
      const r4 = pseudoRandom(i * 7 + 29);

      // 3D scatter translations
      const x = nx * (260 + r1 * 200) + (r2 - 0.5) * 110;
      const y = ny * (220 + r3 * 180) + (r4 - 0.5) * 110;

      // Z depth: center tiles explode forward towards camera (+Z up to 600px)
      const zFactor = Math.max(0, 1.3 - dist * 0.55);
      const z = zFactor * (420 + r1 * 260) + (r3 - 0.5) * 140;

      // 3D compound rotations in degrees
      const rotX = ny * 30 + (r2 - 0.5) * 45;
      const rotY = -nx * 36 + (r4 - 0.5) * 45;
      const rotZ = (r1 - 0.5) * 35;

      // Subtle scale variation
      const scale = 0.76 + r3 * 0.24;

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

      // Reset tile elements initial state
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
          scrub: 0.8, // Smooth spring inertia for mouse wheel and trackpad
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
              }
            } else {
              if (intactWrapperRef.current) {
                intactWrapperRef.current.style.opacity = '0';
                intactWrapperRef.current.style.pointerEvents = 'none';
              }
              if (tilesGridRef.current) {
                tilesGridRef.current.style.opacity = '1';
              }
            }

            if (p >= 0.99) {
              container.style.pointerEvents = 'none';
              if (tilesGridRef.current) tilesGridRef.current.style.display = 'none';
            } else {
              container.style.pointerEvents = 'auto';
              if (tilesGridRef.current) tilesGridRef.current.style.display = 'block';
            }
          },
        },
      });

      // 1. SIMULTANEOUS WORK EMERGENCE: Work appears behind scattering boxes in the same timeline!
      if (workEl) {
        tl.fromTo(
          workEl,
          { opacity: 0.15, scale: 0.94, y: 35 },
          { opacity: 1.0, scale: 1.0, y: 0, duration: 1.0, ease: 'power2.out' },
          0
        );
      }

      // 2. SIMULTANEOUS 3D BOX SCATTER:
      validTileEls.forEach((tileEl, idx) => {
        const traj = tileTrajectories[idx];
        if (!tileEl || !traj) return;

        const startTime = traj.delay * 0.32;
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

      {/* 2. 3D BOX DISINTEGRATION GRID (Progress > 0) */}
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
                boxShadow:
                  '0 0 0 1px rgba(255, 152, 0, 0.22), 0 12px 28px rgba(0, 0, 0, 0.75)',
              }}
            >
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
