import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ scrollToSection }) {
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const headingLinesRef = useRef([]);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const sliderRef = useRef(null);
  const bgImageRef = useRef(null);

  // Functional slider state for the minimal slider interface
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: '/images/hero.png',
      alt: 'Srivathsan holding camera with telephoto lens during golden hour',
      position: 'object-[78%_center] sm:object-[80%_center] lg:object-[84%_center]',
    },
    {
      id: 2,
      image: '/images/Celebrities/1.webp',
      alt: 'Srivathsan concert photography spotlight',
      position: 'object-[75%_center] lg:object-[80%_center]',
    },
    {
      id: 3,
      image: '/images/Nature/1.webp',
      alt: 'Srivathsan nature landscape photography',
      position: 'object-center lg:object-[70%_center]',
    },
    {
      id: 4,
      image: '/images/Celebrities/4.webp',
      alt: 'Srivathsan stage performance portrait',
      position: 'object-[75%_center] lg:object-[80%_center]',
    },
    {
      id: 5,
      image: '/images/Architecture/IMG_20260831_005035.webp',
      alt: 'Srivathsan architecture photography',
      position: 'object-center lg:object-[70%_center]',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
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
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
        .fromTo(sliderRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo(
          bgImageRef.current,
          { scale: 1.04, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' },
          0
        );

      // 2. Smooth Scroll Parallax Fade Out on scroll
      const scrollTargets = [
        tagRef.current,
        ...headingLinesRef.current,
        textRef.current,
        ctaRef.current,
        sliderRef.current,
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

  const currentSlide = heroSlides[activeSlide];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#08090B]"
    >
      {/* =========================================================================
          FULL-BLEED CINEMATIC HERO BACKGROUND (Edge-to-Edge Original Photograph)
          No cards, no borders, no containers — pure full-screen photographic immersion
         ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none overflow-hidden">
        <img
          ref={bgImageRef}
          src={currentSlide.image}
          alt={currentSlide.alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`w-full h-full object-cover ${currentSlide.position} transform-gpu transition-all duration-700 ease-out`}
        />

        {/* Desktop Gradient: Solid dark on left for text readability -> Transparent on right keeping photo bright */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              'linear-gradient(90deg, #08090B 0%, rgba(8,9,11,0.96) 24%, rgba(8,9,11,0.85) 38%, rgba(8,9,11,0.45) 54%, transparent 72%)',
          }}
        />

        {/* Tablet Gradient */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block lg:hidden"
          style={{
            background:
              'linear-gradient(90deg, #08090B 0%, rgba(8,9,11,0.95) 35%, rgba(8,9,11,0.75) 55%, transparent 85%)',
          }}
        />

        {/* Mobile Gradient: Balanced vertical + horizontal fade */}
        <div
          className="absolute inset-0 pointer-events-none sm:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,9,11,0.94) 0%, rgba(8,9,11,0.82) 48%, rgba(8,9,11,0.35) 75%, rgba(8,9,11,0.9) 100%)',
          }}
        />

        {/* Subtle top & bottom edge blending */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#08090B]/90 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08090B] to-transparent pointer-events-none" />
      </div>

      {/* =========================================================================
          HERO TEXT & INTERACTIVE CONTENT (Layered Directly Over the Full-Bleed Photo)
         ========================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-xl xl:max-w-2xl flex flex-col justify-center">

          {/* Label: Warm orange accent line + VISUAL STORYTELLER */}
          <div ref={tagRef} className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-6 h-[2px] bg-[#FF9500] rounded-full" />
            <span className="text-xs font-semibold tracking-[0.3em] text-[#FF9500] uppercase font-mono">
              VISUAL STORYTELLER
            </span>
          </div>

          {/* Main Editorial Heading */}
          <h1 className="font-oswald text-5xl sm:text-7xl lg:text-[76px] xl:text-[88px] font-bold leading-[0.95] tracking-tight uppercase mb-7 sm:mb-8 text-white">
            <span ref={(el) => (headingLinesRef.current[0] = el)} className="block">
              I CAPTURE
            </span>
            <span
              ref={(el) => (headingLinesRef.current[1] = el)}
              className="block text-[#FF9500] bg-gradient-to-r from-[#FF9500] via-[#FFB03A] to-[#FF9A3C] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,149,0,0.25)]"
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
            className="text-sm sm:text-base leading-relaxed text-[#A5A5A5] max-w-lg font-light mb-8 sm:mb-10"
          >
            Photography for me is not just clicking, <br className="hidden sm:inline" />
            it's feeling, observing and preserving memories.
          </p>

          {/* Action Button & Scroll Indicator */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-6 sm:gap-8 mb-10 sm:mb-14">
            <button
              onClick={() => scrollToSection('work')}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-lg border border-[#FF9500]/80 bg-transparent text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#FF9500] hover:text-black hover:border-[#FF9500] hover:shadow-[0_0_25px_rgba(255,149,0,0.45)] transition-all cursor-pointer group"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Glowing SCROLL TO EXPLORE indicator */}
            <button
              onClick={() => scrollToSection('about')}
              className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.25em] text-[#A5A5A5] hover:text-white transition-colors uppercase cursor-pointer group"
            >
              <span>SCROLL TO EXPLORE</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9500] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9500] shadow-[0_0_8px_#FF9500]" />
              </span>
            </button>
          </div>

          {/* Minimal Functional Slider / Counter Indicator */}
          <div
            ref={sliderRef}
            className="flex items-center gap-5 text-xs font-mono text-[#A5A5A5] select-none"
          >
            <span className="w-[2px] h-4 bg-[#FF9500]/70" />
            <span className="tracking-widest text-white/90">
              0{activeSlide + 1} / 0{heroSlides.length}
            </span>
            <div className="flex items-center gap-2">
              {heroSlides.map((slide, index) => {
                const isActive = activeSlide === index;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Go to slide 0${index + 1}`}
                    className="py-2 cursor-pointer group transition-all"
                  >
                    <span
                      className={`block h-[2px] rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-7 bg-[#FF9500] shadow-[0_0_8px_#FF9500]'
                          : 'w-4 bg-white/20 group-hover:bg-white/40'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
