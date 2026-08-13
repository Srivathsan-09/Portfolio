import React, { useState, useEffect, useRef } from 'react';
import { Mail, Send, X, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const buttonsRef = useRef(null);
  const signatureRef = useRef(null);
  const watermarkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text & Buttons Reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(tagRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 })
        .fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          buttonsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          signatureRef.current,
          { scale: 0.85, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
          '-=0.8'
        );

      // 2. Scrubbed Parallax for Watermark "S"
      gsap.fromTo(
        watermarkRef.current,
        { rotate: -10, scale: 0.8, opacity: 0.01 },
        {
          rotate: 5,
          scale: 1.1,
          opacity: 0.03,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormOpen(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2500);
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 lg:py-36 overflow-hidden">
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-magenta-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        
        {/* Section Header Tag */}
        <div ref={tagRef} className="flex items-center gap-4 mb-10">
          <span className="text-xs sm:text-sm font-mono text-[#A855F7] font-semibold tracking-wider">
            03
          </span>
          <span className="w-8 h-[1px] bg-[#A855F7]/40" />
          <span className="text-xs font-semibold tracking-[0.3em] text-[#FF9A3C] uppercase">
            LET'S CONNECT
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Heading & Contact Buttons */}
          <div className="lg:col-span-7">
            <h2 ref={titleRef} className="font-oswald text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] uppercase mb-10 text-white">
              LET'S CREATE <br />
              <span className="text-gradient-contact inline-block">
                SOMETHING MEMORABLE.
              </span>
            </h2>

            {/* Outlined Action Buttons */}
            <div ref={buttonsRef} className="flex flex-wrap items-center gap-4">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=vathsanphotography@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-[0.2em] text-white/90 hover:text-white hover:border-[#D946EF] hover:bg-white/10 hover:shadow-[0_0_25px_rgba(217,70,239,0.3)] transition-all cursor-pointer group"
              >
                <Mail className="w-4 h-4 text-[#D946EF] group-hover:scale-110 transition-transform" />
                <span>EMAIL ME</span>
              </a>

              <a
                href="https://www.instagram.com/visions_of_vathsan/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-[0.2em] text-white/90 hover:text-white hover:border-[#FF9A3C] hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,154,60,0.3)] transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 text-[#FF9A3C] group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>INSTAGRAM</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Handwritten Script Signature & Watermark matching user sign design */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-8 sm:py-12">
            
            {/* Giant Outlined Letter S Watermark centered behind signature */}
            <div
              ref={watermarkRef}
              className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0 overflow-hidden"
            >
              <span className="font-syne font-extrabold text-[220px] sm:text-[280px] lg:text-[320px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.04] to-white/[0.01] select-none transform-gpu opacity-40">
                S
              </span>
            </div>

            {/* Glowing Handwritten Signature */}
            <div ref={signatureRef} className="relative z-10 text-center flex flex-col items-center">
              <div className="font-signature text-7xl sm:text-8xl lg:text-9xl tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D946EF] via-[#EC4899] to-[#FF9A3C] drop-shadow-[0_0_20px_rgba(217,70,239,0.45)] drop-shadow-[0_0_35px_rgba(255,154,60,0.3)] select-none py-2 px-4 leading-tight">
                Srivathsan
              </div>

              <div className="text-[11px] sm:text-xs font-semibold tracking-[0.5em] text-[#85848D] uppercase font-sans mt-1">
                PHOTOGRAPHY
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#03050B]/90 backdrop-blur-2xl transition-all animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#05060C] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.95)]">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-[#D946EF] transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-[#D946EF] mb-4 animate-bounce" />
                <h4 className="font-oswald text-3xl font-bold text-white uppercase mb-2">
                  MESSAGE SENT
                </h4>
                <p className="text-sm text-[#85848D]">
                  Thank you! Srivathsan will get back to you shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-4 h-4 text-[#D946EF]" />
                  <span className="text-xs font-semibold tracking-[0.25em] text-[#A855F7] uppercase">
                    SEND INQUIRY
                  </span>
                </div>

                <h3 className="font-oswald text-3xl font-bold text-white uppercase mb-6">
                  BOOK A SESSION
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#85848D] uppercase mb-1">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#85848D] uppercase mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#85848D] uppercase mb-1">
                      PROJECT / MESSAGE
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your event, portrait session or project..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D946EF] focus:ring-1 focus:ring-[#D946EF] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C026D3] via-[#D946EF] to-[#FF9A3C] text-white font-semibold text-xs tracking-[0.25em] uppercase hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
