import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About({ scrollToSection }) {
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const quoteRef = useRef(null);
  const ctaRef = useRef(null);
  const bgImageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Staggered text & elements entrance on scroll enter
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out', duration: 0.8 },
      });

      tl.fromTo(tagRef.current, { x: -25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 })
        .fromTo(headingRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.3')
        .fromTo(textRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
        .fromTo(quoteRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, '-=0.4')
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');

      // 2. Subtle Parallax Scrub on Full-Bleed Background Image
      gsap.fromTo(
        bgImageRef.current,
        { scale: 1.04, y: -12 },
        {
          scale: 1.0,
          y: 12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#080808] py-28 lg:py-0"
    >
      {/* =========================================================================
          FULL-BLEED CINEMATIC ABOUT BACKGROUND (Edge-to-Edge Original Photograph)
          No cards, no borders, no containers — pure full-screen photographic immersion
         ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none overflow-hidden">
        <img
          ref={bgImageRef}
          src="/images/about.jpg"
          alt="Srivathsan photographer portrait smiling with Canon camera and white lens"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-[56%_20%] sm:object-[84%_center] lg:object-[88%_center] xl:object-[90%_center] transform-gpu transition-all duration-700 ease-out"
        />

        {/* Desktop Gradient: Deep cinematic black on left for text readability -> Transparent on right keeping photo bright */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              'linear-gradient(90deg, #080808 0%, rgba(8,8,8,0.98) 22%, rgba(8,8,8,0.86) 38%, rgba(8,8,8,0.35) 54%, rgba(8,8,8,0.08) 68%, transparent 80%)',
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

        {/* Mobile Gradient: Clear text readability while keeping smiling portrait and camera bright and recognizable */}
        <div
          className="absolute inset-0 pointer-events-none sm:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,8,8,0.72) 0%, rgba(8,8,8,0.48) 32%, rgba(8,8,8,0.25) 55%, rgba(8,8,8,0.85) 80%, #080808 100%)',
          }}
        />

        {/* Deep top & bottom edge blending into #080808 so transition between sections is seamless */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#080808] via-[#080808]/80 to-transparent pointer-events-none z-[5]" />
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-64 bg-gradient-to-t from-[#080808] via-[#080808]/95 via-45% to-transparent pointer-events-none z-[5]" />
      </div>

      {/* =========================================================================
          ABOUT TEXT & NARRATIVE (Layered Directly Over the Full-Bleed Photograph)
         ========================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-24">
        <div className="max-w-xl xl:max-w-2xl flex flex-col justify-center">

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
              From capturing authentic emotions and candid moments to building digital experiences and experimenting with technology, I'm driven by curiosity and creativity.
            </p>
          </div>

          {/* Highlighted Quote Block with Orange Accent Border */}
          <div
            ref={quoteRef}
            className="border-l-2 border-[#FF9800] pl-5 py-1 mb-8 sm:mb-10 max-w-xl bg-gradient-to-r from-[#FF9800]/10 to-transparent rounded-r-lg backdrop-blur-[2px]"
          >
            <p className="text-sm sm:text-base italic text-white/95 leading-relaxed font-light drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
              “Photography taught me to notice the details. Technology taught me to build them. I bring both perspectives into everything I create.”
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
}
