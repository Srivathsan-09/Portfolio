import React, { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ scrollToSection }) {
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const headingLinesRef = useRef([]);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const imageCardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animations on Page Mount (Instant image reveal without delay)
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

      // Animate Hero Image Card immediately without hiding it
      gsap.fromTo(
        imageCardRef.current,
        { scale: 0.96, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );

      tl.fromTo(tagRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, delay: 0.05 })
        .fromTo(
          headingLinesRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08 },
          '-=0.5'
        )
        .fromTo(textRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.5')
        .fromTo(buttonRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.5');

      // 2. Smooth Scroll Fade-Out (Scroll Down) & Fade-In (Scroll Up) at Medium Speed
      const scrollTargets = [
        tagRef.current,
        ...headingLinesRef.current,
        textRef.current,
        buttonRef.current,
        imageCardRef.current,
      ].filter(Boolean);

      gsap.to(scrollTargets, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 25%',
          scrub: 0.6,
        },
        y: -60,
        opacity: 0,
        stagger: 0.03,
        ease: 'power1.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      {/* Hero Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-purple-600/20 via-magenta-500/20 to-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Heading & Intro */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Small purple uppercase label */}
            <div ref={tagRef} className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7] animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.3em] text-[#A855F7] uppercase font-sans">
                VISUAL STORYTELLER
              </span>
            </div>

            {/* Editorial Heading lines */}
            <h1 className="font-oswald text-5xl sm:text-7xl lg:text-8xl xl:text-[90px] font-bold leading-[0.95] tracking-tight uppercase mb-8 text-white">
              <span ref={(el) => (headingLinesRef.current[0] = el)} className="block">
                I CAPTURE
              </span>
              <span
                ref={(el) => (headingLinesRef.current[1] = el)}
                className="block gradient-text font-serif italic font-normal lower-case text-6xl sm:text-8xl lg:text-9xl xl:text-[100px] my-1"
              >
                moments
              </span>
              <span ref={(el) => (headingLinesRef.current[2] = el)} className="block">
                THAT STAY.
              </span>
            </h1>

            {/* Short Intro Subtext */}
            <p
              ref={textRef}
              className="text-base sm:text-lg text-white/70 max-w-xl font-light leading-relaxed mb-10"
            >
              Capturing candid emotion, raw human connection, and striking light.
              Specialized in Editorial Portraits, Events, Nature, and Celebrities.
            </p>

            {/* Dual Action CTA Buttons */}
            <div ref={buttonRef} className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                onClick={() => scrollToSection('work')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#D946EF] to-[#FF9A3C] text-white font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] hover:scale-[1.03] active:scale-95 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10">EXPLORE WORK</span>
                <div className="w-2 h-2 rounded-full bg-white z-10 group-hover:scale-150 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:border-purple-500/60 hover:bg-white/10 hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <span className="relative z-10 group-hover:text-purple-300 transition-colors">
                  GET IN TOUCH
                </span>
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center group-hover:border-purple-400 group-hover:bg-purple-500/40 transition-all">
                  <span className="w-2 h-2 rounded-full bg-[#D946EF] shadow-[0_0_8px_#D946EF] group-hover:scale-125 transition-transform" />
                </div>
              </button>
            </div>

          </div>

          {/* RIGHT SIDE: Portrait Photography Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div
              ref={imageCardRef}
              className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[3/4] rounded-3xl overflow-hidden card-border-glow group shadow-[0_25px_60px_rgba(0,0,0,0.85)] transform-gpu"
            >
              <img
                src="/images/hero.webp"
                alt="Srivathsan photography golden hour silhouette"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#03050B] via-transparent to-transparent opacity-80 pointer-events-none" />
              <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none group-hover:border-purple-500/30 transition-colors" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
