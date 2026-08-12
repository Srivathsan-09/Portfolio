import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StoryStrip() {
  const sectionRef = useRef(null);
  const pinContainerRef = useRef(null);
  const stageRef = useRef(null);

  // Line & Word Refs
  const line1Ref = useRef(null);      // "EVERY FRAME HAS A"
  const storyBoxRef = useRef(null);   // "STORY."
  const line3Ref = useRef(null);      // "EVERY STORY HAS A"
  const soulBoxRef = useRef(null);    // "SOUL."

  // Character Ref Collections for 3D Assembly
  const storyCharRefs = useRef([]);
  const soulCharRefs = useRef([]);

  // Background Depth Spotlights
  const glowPurpleRef = useRef(null);
  const glowOrangeRef = useRef(null);

  const storyWord = ['S', 'T', 'O', 'R', 'Y', '.'];
  const soulWord = ['S', 'O', 'U', 'L', '.'];

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isDesktop = window.innerWidth >= 1024 && !window.matchMedia('(pointer: coarse)').matches;

    const ctx = gsap.context(() => {
      // Scale Z-depth offsets for mobile safety
      const zScale = isMobile ? 0.35 : 1.0;

      // ==================================================
      // PINNED SCROLL-DRIVEN 3D CINEMATIC TIMELINE
      // ==================================================
      if (isReducedMotion) {
        // Reduced Motion Timeline: Simple progressive opacity reveal
        const simpleTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 1,
          },
        });

        simpleTl
          .fromTo(line1Ref.current, { opacity: 0 }, { opacity: 1 })
          .fromTo(storyBoxRef.current, { opacity: 0 }, { opacity: 1 }, '+=0.1')
          .fromTo(line3Ref.current, { opacity: 0 }, { opacity: 1 }, '+=0.1')
          .fromTo(soulBoxRef.current, { opacity: 0 }, { opacity: 1 }, '+=0.1');
      } else {
        // Full Pinned 3D Cinematic Scroll Timeline
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: pinContainerRef.current,
            pinSpacing: true,
          },
        });

        // Initial setup for 3D scene elements - STRICT ZERO PRE-VISIBILITY (opacity: 0)
        gsap.set(line1Ref.current, {
          opacity: 0,
          scale: 0.65,
          z: -450 * zScale,
          rotateX: 18,
          rotateY: -6,
          transformStyle: 'preserve-3d',
        });

        gsap.set(storyBoxRef.current, {
          opacity: 0,
          scale: 0.4,
          z: -600 * zScale,
          rotateY: 30,
          rotateX: -12,
          transformStyle: 'preserve-3d',
        });

        gsap.set(line3Ref.current, {
          opacity: 0,
          scale: 0.65,
          z: -600 * zScale,
          rotateX: 12,
          transformStyle: 'preserve-3d',
        });

        gsap.set(soulBoxRef.current, {
          opacity: 0,
          scale: 0.35,
          z: -750 * zScale,
          rotateY: -28,
          rotateX: 12,
          transformStyle: 'preserve-3d',
        });

        // 3D Character initial offsets
        storyCharRefs.current.forEach((charEl, idx) => {
          if (!charEl) return;
          const initialZ = [-90, -50, -10, 10, 50, 70][idx] * zScale;
          const initialRotY = [-14, -9, -4, 4, 9, 14][idx];
          gsap.set(charEl, { z: initialZ, rotateY: initialRotY, transformStyle: 'preserve-3d' });
        });

        soulCharRefs.current.forEach((charEl, idx) => {
          if (!charEl) return;
          const initialZ = [-110, -55, 0, 55, 90][idx] * zScale;
          const initialRotY = [14, 9, 0, -9, -14][idx];
          gsap.set(charEl, { z: initialZ, rotateY: initialRotY, transformStyle: 'preserve-3d' });
        });

        // --------------------------------------------------
        // SCENE 1: INTRO ("EVERY FRAME HAS A" - Fades in cleanly during scroll)
        // --------------------------------------------------
        scrollTl.to(
          line1Ref.current,
          {
            opacity: 1,
            scale: 1,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 1.0,
            ease: 'power2.out',
          },
          0
        );

        // --------------------------------------------------
        // SCENE 2: STORY. ("STORY." 3D Assembly & Volumetric Purple Glow)
        // --------------------------------------------------
        scrollTl
          .to(
            storyBoxRef.current,
            {
              opacity: 1,
              scale: 1.12,
              z: 35 * zScale,
              rotateY: 0,
              rotateX: 0,
              duration: 1.3,
              ease: 'power2.out',
            },
            0.5
          )
          .to(
            storyCharRefs.current,
            {
              z: 0,
              rotateY: 0,
              duration: 1.3,
              stagger: 0.04,
              ease: 'power2.out',
            },
            0.5
          )
          .to(
            glowPurpleRef.current,
            {
              opacity: 0.75,
              scale: 1.3,
              duration: 1.3,
              ease: 'power2.out',
            },
            0.5
          );

        // --------------------------------------------------
        // SCENE 3: TRANSITION (Line 1 Recedes, "EVERY STORY HAS A" Enters)
        // --------------------------------------------------
        scrollTl
          .to(
            line1Ref.current,
            {
              z: -160 * zScale,
              scale: 0.88,
              opacity: 0.65,
              duration: 0.9,
              ease: 'power1.inOut',
            },
            1.6
          )
          .to(
            storyBoxRef.current,
            {
              scale: 1.0,
              z: 0,
              duration: 0.9,
              ease: 'power1.inOut',
            },
            1.6
          )
          .to(
            line3Ref.current,
            {
              opacity: 1,
              scale: 1,
              z: 0,
              rotateX: 0,
              duration: 1.2,
              ease: 'power2.out',
            },
            1.6
          );

        // --------------------------------------------------
        // SCENE 4: SOUL. ("SOUL." 3D Climax & Orange Volumetric Glow)
        // --------------------------------------------------
        scrollTl
          .to(
            soulBoxRef.current,
            {
              opacity: 1,
              scale: 1.15,
              z: 45 * zScale,
              rotateY: 0,
              rotateX: 0,
              duration: 1.4,
              ease: 'power2.out',
            },
            2.6
          )
          .to(
            soulCharRefs.current,
            {
              z: 0,
              rotateY: 0,
              duration: 1.4,
              stagger: 0.04,
              ease: 'power2.out',
            },
            2.6
          )
          .to(
            glowOrangeRef.current,
            {
              opacity: 0.75,
              scale: 1.3,
              duration: 1.4,
              ease: 'power2.out',
            },
            2.6
          );

        // --------------------------------------------------
        // FINAL COMPOSITION SETTLEMENT (Everything settles into exact design)
        // --------------------------------------------------
        scrollTl
          .to(
            [line1Ref.current, storyBoxRef.current, line3Ref.current, soulBoxRef.current],
            {
              z: 0,
              scale: 1.0,
              opacity: 1,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              duration: 0.8,
              ease: 'power2.out',
            },
            3.8
          )
          .to(
            [glowPurpleRef.current, glowOrangeRef.current],
            {
              opacity: 0.45,
              scale: 1.0,
              duration: 0.8,
              ease: 'power2.out',
            },
            3.8
          );
      }

      // ==================================================
      // DESKTOP INTERACTIVE MOUSE CAMERA DEPTH & VELOCITY
      // ==================================================
      if (isDesktop && !isReducedMotion) {
        const qStageX = gsap.quickTo(stageRef.current, 'x', { duration: 0.8, ease: 'power3.out' });
        const qStageY = gsap.quickTo(stageRef.current, 'y', { duration: 0.8, ease: 'power3.out' });
        const qStageRotX = gsap.quickTo(stageRef.current, 'rotateX', { duration: 0.8, ease: 'power3.out' });
        const qStageRotY = gsap.quickTo(stageRef.current, 'rotateY', { duration: 0.8, ease: 'power3.out' });

        const qStoryShadow = gsap.quickTo(storyBoxRef.current, 'textShadow', { duration: 0.8, ease: 'power3.out' });
        const qSoulShadow = gsap.quickTo(soulBoxRef.current, 'textShadow', { duration: 0.8, ease: 'power3.out' });

        let lastX = 0;
        let lastY = 0;
        let lastTime = Date.now();

        const handleMouseMove = (e) => {
          const sectionEl = sectionRef.current;
          if (!sectionEl) return;

          const rect = sectionEl.getBoundingClientRect();
          if (e.clientY < rect.top || e.clientY > rect.bottom) {
            handleMouseLeave();
            return;
          }

          const now = Date.now();
          const dt = Math.max(1, now - lastTime);
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          const speed = Math.hypot(dx, dy) / dt;

          lastX = e.clientX;
          lastY = e.clientY;
          lastTime = now;

          const velocityNorm = Math.min(1, speed / 2.8);
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const normX = (e.clientX - centerX) / (rect.width / 2);
          const normY = (e.clientY - centerY) / (rect.height / 2);

          // Subtle 3D Camera tilt
          qStageX(normX * 12);
          qStageY(normY * 8);
          qStageRotX(normY * -3);
          qStageRotY(normX * 4);

          // Micro RGB Chromatic Shift on Fast Mouse Velocity
          const chromaShift = velocityNorm * 1.5;
          if (chromaShift > 0.2) {
            qStoryShadow(`${chromaShift.toFixed(1)}px 0px rgba(217,70,239,0.5), ${(-chromaShift).toFixed(1)}px 0px rgba(255,154,60,0.4)`);
            qSoulShadow(`${chromaShift.toFixed(1)}px 0px rgba(255,154,60,0.5), ${(-chromaShift).toFixed(1)}px 0px rgba(217,70,239,0.4)`);
          } else {
            qStoryShadow('0px 0px rgba(0,0,0,0)');
            qSoulShadow('0px 0px rgba(0,0,0,0)');
          }
        };

        const handleMouseLeave = () => {
          qStageX(0);
          qStageY(0);
          qStageRotX(0);
          qStageRotY(0);
          qStoryShadow('0px 0px rgba(0,0,0,0)');
          qSoulShadow('0px 0px rgba(0,0,0,0)');
        };

        window.addEventListener('mousemove', handleMouseMove);
        sectionRef.current.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          if (sectionRef.current) {
            sectionRef.current.removeEventListener('mouseleave', handleMouseLeave);
          }
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[140vh] my-0 overflow-visible select-none">
      {/* 
        PINNED VIEWPORT CONTAINER (Sticky 100vh)
        Scroll controls 3D animation timeline via GSAP ScrollTrigger scrub
      */}
      <div
        ref={pinContainerRef}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[1200px] pointer-events-auto transform-gpu"
        style={{ perspective: '1200px' }}
      >
        {/* Layer 1: Background Depth Spotlights */}
        <div
          ref={glowPurpleRef}
          className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[320px] bg-gradient-to-r from-[#C026D3]/35 via-[#D946EF]/25 to-transparent rounded-full blur-[140px] pointer-events-none opacity-20 transform-gpu"
          style={{ transform: 'translateZ(-800px)' }}
        />
        <div
          ref={glowOrangeRef}
          className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[450px] h-[320px] bg-gradient-to-r from-[#FF9A3C]/35 via-[#F97316]/25 to-transparent rounded-full blur-[140px] pointer-events-none opacity-20 transform-gpu"
          style={{ transform: 'translateZ(-800px)' }}
        />

        {/* 3D TYPOGRAPHY STAGE (preserve-3d) */}
        <div
          ref={stageRef}
          className="max-w-6xl mx-auto px-6 text-center relative z-10 preserve-3d transform-gpu w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* LINE 1 & LINE 2 (EVERY FRAME HAS A STORY.) */}
          <div
            className="font-oswald text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-tight leading-[1.05] mb-4 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 preserve-3d transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* SCENE 1: LINE 1 - EVERY FRAME HAS A */}
            <span
              ref={line1Ref}
              className="inline-block text-white preserve-3d transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              EVERY FRAME HAS A
            </span>

            {/* SCENE 2: STORY. (3D Character Assembly) */}
            <span
              ref={storyBoxRef}
              className="inline-flex items-center text-gradient-purple drop-shadow-[0_0_20px_rgba(217,70,239,0.4)] preserve-3d transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {storyWord.map((char, i) => (
                <span
                  key={i}
                  ref={(el) => (storyCharRefs.current[i] = el)}
                  className="inline-block preserve-3d transform-gpu"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char}
                </span>
              ))}
            </span>
          </div>

          {/* LINE 3 & LINE 4 (EVERY STORY HAS A SOUL.) */}
          <div
            className="font-oswald text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-tight leading-[1.05] flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 preserve-3d transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* SCENE 3: LINE 3 - EVERY STORY HAS A */}
            <span
              ref={line3Ref}
              className="inline-block text-white preserve-3d transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              EVERY STORY HAS A
            </span>

            {/* SCENE 4: SOUL. (3D Character Assembly) */}
            <span
              ref={soulBoxRef}
              className="inline-flex items-center text-gradient-orange drop-shadow-[0_0_20px_rgba(255,154,60,0.4)] preserve-3d transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {soulWord.map((char, i) => (
                <span
                  key={i}
                  ref={(el) => (soulCharRefs.current[i] = el)}
                  className="inline-block preserve-3d transform-gpu"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
