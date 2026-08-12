import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text & Header Reveal on Scroll Enter
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(tagRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 })
        .fromTo(
          headingRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          textRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          cardRef.current,
          { y: 60, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
          '-=0.8'
        );

      // 2. Parallax Image Zoom Scrub inside Card
      gsap.fromTo(
        imgRef.current,
        { scale: 1.25, y: -20 },
        {
          scale: 1.0,
          y: 20,
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
    <section ref={sectionRef} id="about" className="relative py-24 lg:py-36 overflow-hidden">
      <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        
        {/* Section Header Tag */}
        <div ref={tagRef} className="flex items-center gap-4 mb-12">
          <span className="text-xs sm:text-sm font-mono text-[#A855F7] font-semibold tracking-wider">
            01
          </span>
          <span className="w-8 h-[1px] bg-[#A855F7]/40" />
          <span className="text-xs font-semibold tracking-[0.3em] text-[#FF9A3C] uppercase">
            ABOUT ME
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Heading & Text */}
          <div className="lg:col-span-6">
            <h2 ref={headingRef} className="font-oswald text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] uppercase mb-8 text-white">
              THE MIND <br />
              <span className="text-gradient-purple inline-block">
                BEHIND THE LENS.
              </span>
            </h2>

            <div ref={textRef} className="space-y-4 text-base sm:text-lg leading-relaxed text-[#85848D] font-light max-w-lg">
              <p>
                I’m Srivathsan, a visual storyteller, photographer, and creator who loves turning ideas and moments into something people can experience.
              </p>
              <p>
                From capturing authentic emotions and candid moments to building digital experiences and experimenting with technology, I’m driven by curiosity and creativity.
              </p>
              <p className="text-white/90 font-normal border-l-2 border-[#D946EF] pl-4 italic">
                “Photography taught me to notice the details. Technology taught me to build them. I bring both perspectives into everything I create.”
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: B&W Editorial Portrait Image Card with Scroll Parallax */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div
              ref={cardRef}
              className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[3/4] rounded-3xl overflow-hidden card-border-glow shadow-[0_25px_60px_rgba(0,0,0,0.85)] group"
            >
              <img
                ref={imgRef}
                src="/images/about.jpg"
                alt="Srivathsan holding Canon camera portrait"
                className="w-full h-full object-cover object-top transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#03050B] via-transparent to-black/20 opacity-80 pointer-events-none" />
              <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none group-hover:border-purple-500/40 transition-colors" />

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-white/70 font-mono">
                <span>EST. 2018</span>
                <span className="text-[#D946EF]">FRAMING REALITY</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
