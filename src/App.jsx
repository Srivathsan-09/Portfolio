import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CinematicBackground from './components/CinematicBackground';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import StoryStrip from './components/StoryStrip';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [lenisRef, setLenisRef] = useState(null);
  const scrollProgressRef = useRef(null);

  // Initialize Lenis Smooth Scrolling & GSAP ScrollTrigger ticker integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
    });

    setLenisRef(lenis);
    window.lenis = lenis; // Expose globally for modals to stop/start smooth scroll

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      // Update top scroll progress bar
      if (scrollProgressRef.current) {
        const progress = e.scroll / (document.documentElement.scrollHeight - window.innerHeight);
        scrollProgressRef.current.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      delete window.lenis;
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Throttled Active section observer on scroll
  useEffect(() => {
    const sections = ['hero', 'about', 'work', 'contact'];
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + window.innerHeight / 3;
          for (const sectionId of sections) {
            const el = document.getElementById(sectionId);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection((prev) => (prev !== sectionId ? sectionId : prev));
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenisRef) {
        lenisRef.scrollTo(el, { offset: -60 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#03050B] text-[#F2F0F4] font-sans selection:bg-[#A855F7] selection:text-white">
      {/* Scroll Progress Bar at very top */}
      <div
        ref={scrollProgressRef}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#A855F7] via-[#D946EF] to-[#FF9A3C] z-[100] origin-left shadow-[0_0_12px_#D946EF] pointer-events-none transform scale-x-0 transition-transform duration-75"
      />

      {/* Dynamic Animated Cinematic Background */}
      <CinematicBackground />

      {/* Interactive Glowing Cursor */}
      <CustomCursor />

      {/* Fixed Sticky Header Navbar */}
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* Main Scroll-Driven Page Sections */}
      <main className="relative z-10">
        <Hero scrollToSection={scrollToSection} />
        <About />
        <Work />
        <StoryStrip />
        <Contact />
      </main>

      {/* Minimal Footer */}
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}
