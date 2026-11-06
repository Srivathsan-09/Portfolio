import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aboutPortrait from '../assets/about-portrait.jpg';
import aboutMobile from '../assets/about-mobile.jpg';

gsap.registerPlugin(ScrollTrigger);

const About = forwardRef(function About({ scrollToSection, isLayer = false }, ref) {
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const quoteRef = useRef(null);
  const ctaRef = useRef(null);
  const bgWrapperRef = useRef(null);

  /**
   * Programmatic Staggered Content Reveal
   * Invoked when revealed via the 3D page transition or direct navigation
   */
  const playReveal = () => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const targets = [
      tagRef.current,
      headingRef.current,
      textRef.current,
      quoteRef.current,
      ctaRef.current,
    ].filter(Boolean);

    gsap.fromTo(
      targets,
      { y: 20, opacity: 0.4 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out' }
    );
  };

  const resetReveal = () => {
    // Keep elements fully visible to avoid blank screens
    const targets = [
      tagRef.current,
      headingRef.current,
      textRef.current,
      quoteRef.current,
      ctaRef.current,
    ].filter(Boolean);
    gsap.set(targets, { opacity: 1, y: 0, x: 0 });
  };

  useImperativeHandle(ref, () => ({
    playReveal,
    resetReveal,
  }));

  useEffect(() => {
    // If running in layered 3D mode, the 3D transition coordinates the initial reveal
    if (isLayer) return;

    const ctx = gsap.context(() => {
      // 1. Subtle parallax scrub on image container
      gsap.fromTo(
        bgWrapperRef.current,
        { y: -16 },
        {
          y: 16,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isLayer]);

  // Micro-interaction on mouse move for subtle image movement on desktop
  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * -7;
    const yPos = (clientY / window.innerHeight - 0.5) * -7;
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

  return (
    <section
      ref={sectionRef}
      id="about"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#080808] py-28 lg:py-0"
    >
      {/* =========================================================================
          FULL-BLEED CINEMATIC ABOUT BACKGROUND WITH MULTI-PANEL CURTAIN REVEAL
          No cards, no borders, no containers — pure full-screen photographic immersion
         ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none overflow-hidden">
        <div ref={bgWrapperRef} className="absolute inset-0 w-full h-full will-change-transform">
          {/* Pristine Original Portrait: Mobile centered crop & Desktop wide */}
          <picture className="block w-full h-full">
            <source media="(max-width: 639px)" srcSet={aboutMobile} />
            <img
              src={aboutPortrait}
              alt="Srivathsan photographer portrait in blue denim shirt holding Canon camera with white telephoto lens"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[center_top] sm:object-[72%_25%] lg:object-[72%_center] xl:object-[75%_center]"
            />
          </picture>
        </div>

        {/* Desktop Gradient: Deep cinematic black on left for text readability -> Transparent on right */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              'linear-gradient(90deg, #080808 0%, #080808 26%, rgba(8,8,8,0.92) 40%, rgba(8,8,8,0.5) 54%, rgba(8,8,8,0.1) 65%, transparent 75%)',
          }}
        />

        {/* Tablet Gradient */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block lg:hidden"
          style={{
            background:
              'linear-gradient(90deg, #080808 0%, rgba(8,8,8,0.95) 36%, rgba(8,8,8,0.72) 56%, transparent 85%)',
          }}
        />

        {/* Mobile Gradient */}
        <div
          className="absolute inset-0 pointer-events-none sm:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.2) 28%, rgba(8,8,8,0.6) 55%, rgba(8,8,8,0.95) 80%, #080808 100%)',
          }}
        />

        {/* Top & bottom edge blending */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#080808] via-[#080808]/80 to-transparent pointer-events-none z-[5]" />
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-64 bg-gradient-to-t from-[#080808] via-[#080808]/95 via-45% to-transparent pointer-events-none z-[5]" />
      </div>

      {/* =========================================================================
          ABOUT TEXT & NARRATIVE
         ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-12 lg:py-24 flex lg:justify-start">
        <div className="max-w-xl xl:max-w-xl flex flex-col justify-center lg:mr-auto lg:ml-2 xl:ml-6">

          {/* Label: Warm orange accent line + ABOUT ME */}
          <div ref={tagRef} className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-6 h-[2px] bg-[#FF9800] rounded-full" />
            <span className="text-xs font-semibold tracking-[0.3em] text-[#FF9800] uppercase font-mono">
              ABOUT ME
            </span>
          </div>

          {/* Main Editorial Heading */}
          <h2
            ref={headingRef}
            className="font-oswald text-5xl sm:text-7xl lg:text-[76px] xl:text-[84px] font-bold leading-[0.95] tracking-tight uppercase mb-8 text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]"
          >
            <span className="block">THE MIND</span>
            <span className="text-[#FF9800] block bg-gradient-to-r from-[#FF9800] via-[#FFB02E] to-[#FFA726] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,152,0,0.25)]">
              BEHIND THE
            </span>
            <span className="block">LENS.</span>
          </h2>

          {/* Story Paragraphs */}
          <div ref={textRef} className="space-y-4 text-sm sm:text-base leading-relaxed text-[#A0A0A0] font-light max-w-xl mb-6 sm:mb-8 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
            <p>
              I'm Srivathsan, a visual storyteller, photographer, and creator who loves turning ideas and moments into something people can experience.
            </p>
            <p>
              From fleeting expressions and candid moments to the little details people often miss, I'm driven by the beauty of seeing the world through my lens.
            </p>
          </div>

          {/* Highlighted Quote Block with Orange Accent Border */}
          <div
            ref={quoteRef}
            className="border-l-2 border-[#FF9800] pl-5 py-1 mb-8 sm:mb-10 max-w-xl bg-gradient-to-r from-[#FF9800]/10 to-transparent rounded-r-lg backdrop-blur-[2px]"
          >
            <p className="text-sm sm:text-base italic text-white/95 leading-relaxed font-light drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              “Photography taught me to slow down, observe the little things, and find stories in moments that might otherwise go unnoticed.”
            </p>
          </div>

          {/* CTA Button */}
          <div ref={ctaRef}>
            <button
              onClick={() => (scrollToSection ? scrollToSection('work') : null)}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-lg border border-[#FF9800]/80 bg-transparent text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#FF9800] hover:text-black hover:border-[#FF9800] hover:shadow-[0_0_25px_rgba(255,152,0,0.45)] transition-all cursor-pointer group"
            >
              <span>GET TO KNOW ME</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
});

export default About;
