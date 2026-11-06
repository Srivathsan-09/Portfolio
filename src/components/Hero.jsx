import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroMobile from '../assets/hero-mobile.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ scrollToSection }) {
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const headingLinesRef = useRef([]);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const bgWrapperRef = useRef(null);
  const lightSweepRef = useRef(null);
  const curtainPanelsRef = useRef([]);

  const activeSlide = 0;

  const heroSlides = [
    {
      id: 1,
      image: '/images/hero.png',
      alt: 'Srivathsan holding camera with telephoto lens during golden hour',
      position: 'object-[54%_25%] sm:object-[70%_center] lg:object-center',
      shiftRight: true,
    },
    {
      id: 2,
      image: '/images/Celebrities/1.webp',
      alt: 'Srivathsan concert photography spotlight',
      position: 'object-[65%_center] sm:object-[78%_center] lg:object-[82%_center]',
      shiftRight: false,
    },
    {
      id: 3,
      image: '/images/Nature/1.webp',
      alt: 'Srivathsan nature landscape photography',
      position: 'object-center lg:object-[72%_center]',
      shiftRight: false,
    },
    {
      id: 4,
      image: '/images/Celebrities/4.webp',
      alt: 'Srivathsan stage performance portrait',
      position: 'object-[65%_center] sm:object-[78%_center] lg:object-[82%_center]',
      shiftRight: false,
    },
    {
      id: 5,
      image: '/images/Architecture/IMG_20260831_005035.webp',
      alt: 'Srivathsan architecture photography',
      position: 'object-center lg:object-[72%_center]',
      shiftRight: false,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Entrance Animations on Page Mount
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

      tl.fromTo(tagRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(
          headingLinesRef.current,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1 },
          '-=0.4'
        )
        .fromTo(textRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5');

      if (!isReduced) {
        // Multi-Panel Curtain Reveal: 5 vertical panels unveil with power4.inOut
        const validPanels = curtainPanelsRef.current.filter(Boolean);
        if (validPanels.length > 0) {
          tl.to(
            validPanels,
            {
              scaleY: 0,
              transformOrigin: 'top',
              duration: 1.2,
              stagger: 0.08,
              ease: 'power4.inOut',
            },
            0.1
          );
        }

        // Restrained Cinematic Depth: Subtle scale 1.04 -> 1.0
        if (bgWrapperRef.current) {
          tl.fromTo(
            bgWrapperRef.current,
            { scale: 1.04 },
            { scale: 1.0, duration: 1.5, ease: 'expo.out' },
            0.05
          );
        }

        // Warm light sweep during the reveal
        if (lightSweepRef.current) {
          tl.fromTo(
            lightSweepRef.current,
            { x: '-100%', opacity: 0 },
            { x: '220%', opacity: 1, duration: 1.35, ease: 'power2.inOut' },
            0.25
          );
        }
      } else {
        const validPanels = curtainPanelsRef.current.filter(Boolean);
        if (validPanels.length > 0) {
          gsap.set(validPanels, { scaleY: 0 });
        }
      }

      // 2. Smooth Scroll Parallax Fade Out on scroll
      const scrollTargets = [
        tagRef.current,
        ...headingLinesRef.current,
        textRef.current,
        ctaRef.current,
      ].filter(Boolean);

      gsap.to(scrollTargets, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top -5%',
          end: 'bottom 35%',
          scrub: 0.6,
        },
        y: -40,
        opacity: 0,
        stagger: 0.02,
        ease: 'power1.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Micro-interaction on mouse move for subtle image movement on desktop
  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 8;
    const yPos = (clientY / window.innerHeight - 0.5) * 8;
    if (bgWrapperRef.current) {
      gsap.to(bgWrapperRef.current, {
        x: xPos,
        y: yPos,
        duration: 1.4,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    }
  };

  const currentSlide = heroSlides[activeSlide];

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#080808]"
    >
      {/* =========================================================================
          CINEMATIC HERO BACKGROUND WITH MULTI-PANEL CURTAIN REVEAL
          Shifts photograph towards the right (face at ~72% of viewport width)
          while keeping left side clear for the heading and description.
         ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none overflow-hidden bg-[#080808]">
        {/* Positioned Image Container: Shifts right on desktop, centered on mobile */}
        <div
          ref={bgWrapperRef}
          className={`absolute inset-y-0 h-full transition-all duration-700 ease-out will-change-transform ${
            currentSlide.shiftRight
              ? 'left-0 w-full lg:left-[15%] xl:left-[16%] lg:w-[100%] xl:w-[100%]'
              : 'left-0 w-full'
          }`}
        >
          {/* Pristine Original Photograph: Mobile portrait crop & Desktop widescreen */}
          <picture className="block w-full h-full">
            <source media="(max-width: 639px)" srcSet={heroMobile} />
            <img
              src={currentSlide.image}
              alt={currentSlide.alt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className={`w-full h-full object-cover object-[center_top] sm:${currentSlide.position}`}
            />
          </picture>

          {/* Warm Light Sweep Layer */}
          <div
            ref={lightSweepRef}
            className="absolute inset-0 pointer-events-none z-10 opacity-0 transform-gpu will-change-transform"
            style={{
              background:
                'linear-gradient(105deg, transparent 20%, rgba(255, 152, 0, 0.12) 42%, rgba(255, 176, 46, 0.28) 50%, rgba(255, 152, 0, 0.12) 58%, transparent 80%)',
            }}
          />

          {/* Multi-Panel Curtain Reveal: 5 Seamless Vertical Panels */}
          <div className="absolute inset-0 flex pointer-events-none z-20 overflow-hidden">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                ref={(el) => (curtainPanelsRef.current[i] = el)}
                className="flex-1 h-full bg-[#080808] -mr-[1px] origin-top will-change-transform"
              />
            ))}
          </div>
        </div>

        {/* Desktop Gradient: Deep solid black on left for text readability -> 100% transparent by 60% keeping face naturally illuminated */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              'linear-gradient(90deg, #080808 0%, #080808 24%, rgba(8,8,8,0.92) 34%, rgba(8,8,8,0.5) 44%, rgba(8,8,8,0.1) 52%, transparent 60%)',
          }}
        />

        {/* Tablet Gradient */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block lg:hidden"
          style={{
            background:
              'linear-gradient(90deg, #080808 0%, rgba(8,8,8,0.95) 30%, rgba(8,8,8,0.65) 50%, transparent 75%)',
          }}
        />

        {/* Mobile Gradient: Balanced vertical fade keeping photographer & sunset golden hour clearly visible */}
        <div
          className="absolute inset-0 pointer-events-none sm:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,8,8,0.72) 0%, rgba(8,8,8,0.45) 32%, rgba(8,8,8,0.2) 58%, rgba(8,8,8,0.85) 86%, #080808 100%)',
          }}
        />

        {/* Subtle top & bottom edge blending */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#080808]/90 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent pointer-events-none z-[5]" />
      </div>

      {/* =========================================================================
          HERO TEXT & INTERACTIVE CONTENT (Layered Directly Over the Photo)
         ========================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-xl xl:max-w-xl flex flex-col justify-center">

          {/* Label: Warm cinematic orange accent line + VISUAL STORYTELLER */}
          <div ref={tagRef} className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-6 h-[2px] bg-[#FF9800] rounded-full" />
            <span className="text-xs font-semibold tracking-[0.3em] text-[#FF9800] uppercase font-mono">
              VISUAL STORYTELLER
            </span>
          </div>

          {/* Main Editorial Heading */}
          <h1 className="font-oswald text-5xl sm:text-7xl lg:text-[76px] xl:text-[88px] font-bold leading-[0.95] tracking-tight uppercase mb-7 sm:mb-8 text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
            <span ref={(el) => (headingLinesRef.current[0] = el)} className="block">
              I CAPTURE
            </span>
            <span
              ref={(el) => (headingLinesRef.current[1] = el)}
              className="block text-[#FF9800] bg-gradient-to-r from-[#FF9800] via-[#FFB02E] to-[#FFA726] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,152,0,0.35)]"
            >
              MOMENTS THAT
            </span>
            <span ref={(el) => (headingLinesRef.current[2] = el)} className="block">
              STAY.
            </span>
          </h1>

          {/* Description Paragraph */}
          <p
            ref={textRef}
            className="text-sm sm:text-base leading-relaxed text-[#A0A0A0] max-w-lg font-light mb-8 sm:mb-10 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]"
          >
            Photography for me is not just clicking, <br className="hidden sm:inline" />
            it's feeling, observing and preserving memories.
          </p>

          {/* Action Button & Scroll Indicator */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-6 sm:gap-8">
            <button
              onClick={() => scrollToSection('work')}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-lg border border-[#FF9800]/80 bg-transparent text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#FF9800] hover:text-black hover:border-[#FF9800] hover:shadow-[0_0_25px_rgba(255,152,0,0.45)] transition-all cursor-pointer group"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Glowing SCROLL TO EXPLORE indicator */}
            <button
              onClick={() => scrollToSection('about')}
              className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors uppercase cursor-pointer group"
            >
              <span>SCROLL TO EXPLORE</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9800] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9800] shadow-[0_0_8px_#FF9800]" />
              </span>
            </button>
          </div>


        </div>
      </div>
    </section>
  );
}
