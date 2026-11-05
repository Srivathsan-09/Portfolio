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
  const imageContainerRef = useRef(null);
  const imgRef = useRef(null);

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
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo(
          imageContainerRef.current,
          { x: 40, opacity: 0, scale: 0.96 },
          { x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' },
          '-=0.8'
        );

      // 2. Subtle Parallax Scrub on Image
      gsap.fromTo(
        imgRef.current,
        { scale: 1.08, y: -15 },
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
      className="relative py-24 sm:py-28 lg:py-36 overflow-hidden bg-[#08090B]"
    >
      {/* Warm Ambient Glow behind photo */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#FF9500]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE: Heading, Narrative & Quote */}
          <div className="lg:col-span-6 flex flex-col justify-center">

            {/* Label: Warm orange accent line + ABOUT ME */}
            <div ref={tagRef} className="flex items-center gap-3 mb-6 sm:mb-8">
              <span className="w-6 h-[2px] bg-[#FF9500] rounded-full" />
              <span className="text-xs font-semibold tracking-[0.3em] text-[#FF9500] uppercase font-mono">
                ABOUT ME
              </span>
            </div>

            {/* Main Heading */}
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

          {/* RIGHT SIDE: User's Original Portrait with Seamless Background Blend */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div
              ref={imageContainerRef}
              className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10] rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/10 group transform-gpu"
            >
              {/* User's Original Photograph */}
              <img
                ref={imgRef}
                src="/images/about.jpg"
                alt="Srivathsan photographer portrait smiling with Canon camera and white lens"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-[center_25%] transition-transform duration-700 ease-out"
              />

              {/* Seamless horizontal gradient blend on the left edge matching reference */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#08090B] via-[#08090B]/30 to-transparent hidden sm:block pointer-events-none" />

              {/* Mobile gradient overlay for gentle blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090B]/70 via-transparent to-[#08090B]/30 sm:hidden pointer-events-none" />

              {/* Glowing border highlight on hover */}
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl border border-white/5 pointer-events-none group-hover:border-[#FF9500]/40 transition-colors duration-500" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
