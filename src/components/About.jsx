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
        { scale: 1.05, y: -15 },
        {
          scale: 1.0,
          y: 15,
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
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#08090B] py-28 lg:py-0"
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
          className="w-full h-full object-cover object-[78%_center] sm:object-[80%_center] lg:object-[86%_center] transform-gpu transition-all duration-700 ease-out"
        />

        {/* Desktop Gradient: Solid dark on left for text readability -> Transparent on right keeping photo bright */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              'linear-gradient(90deg, #08090B 0%, rgba(8,9,11,0.96) 26%, rgba(8,9,11,0.85) 42%, rgba(8,9,11,0.4) 58%, transparent 76%)',
          }}
        />

        {/* Tablet Gradient */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block lg:hidden"
          style={{
            background:
              'linear-gradient(90deg, #08090B 0%, rgba(8,9,11,0.95) 36%, rgba(8,9,11,0.78) 56%, transparent 85%)',
          }}
        />

        {/* Mobile Gradient: Balanced vertical fade */}
        <div
          className="absolute inset-0 pointer-events-none sm:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,9,11,0.94) 0%, rgba(8,9,11,0.82) 48%, rgba(8,9,11,0.35) 75%, rgba(8,9,11,0.9) 100%)',
          }}
        />

        {/* Subtle top & bottom edge blending */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#08090B] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08090B] to-transparent pointer-events-none" />
      </div>

      {/* =========================================================================
          ABOUT TEXT & NARRATIVE (Layered Directly Over the Full-Bleed Photograph)
         ========================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-24">
        <div className="max-w-xl xl:max-w-2xl flex flex-col justify-center">

          {/* Label: Warm orange accent line + ABOUT ME */}
          <div ref={tagRef} className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-6 h-[2px] bg-[#FF9500] rounded-full" />
            <span className="text-xs font-semibold tracking-[0.3em] text-[#FF9500] uppercase font-mono">
              ABOUT ME
            </span>
          </div>

          {/* Main Editorial Heading */}
          <h2
            ref={headingRef}
            className="font-oswald text-5xl sm:text-7xl lg:text-[76px] xl:text-[84px] font-bold leading-[0.95] tracking-tight uppercase mb-8 text-white"
          >
            <span className="block">THE MIND</span>
            <span className="text-[#FF9500] block drop-shadow-[0_0_25px_rgba(255,149,0,0.25)]">
              BEHIND THE
            </span>
            <span className="block">LENS.</span>
          </h2>

          {/* Story Paragraphs */}
          <div ref={textRef} className="space-y-4 text-sm sm:text-base leading-relaxed text-[#A5A5A5] font-light max-w-xl mb-6 sm:mb-8">
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
            className="border-l-2 border-[#FF9500] pl-5 py-1 mb-8 sm:mb-10 max-w-xl bg-gradient-to-r from-[#FF9500]/5 to-transparent rounded-r-lg"
          >
            <p className="text-sm sm:text-base italic text-white/95 leading-relaxed font-light">
              “Photography taught me to notice the details. Technology taught me to build them. I bring both perspectives into everything I create.”
            </p>
          </div>

          {/* CTA Button */}
          <div ref={ctaRef}>
            <button
              onClick={() => (scrollToSection ? scrollToSection('work') : null)}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-lg border border-[#FF9500]/80 bg-transparent text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#FF9500] hover:text-black hover:border-[#FF9500] hover:shadow-[0_0_25px_rgba(255,149,0,0.45)] transition-all cursor-pointer group"
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
