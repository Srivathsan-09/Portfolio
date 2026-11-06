import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CinematicBackground from './components/CinematicBackground';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Page3DTransition from './components/Page3DTransition';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import StoryStrip from './components/StoryStrip';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#about') {
      return 'about';
    }
    return 'hero';
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });
  const [lenisRef, setLenisRef] = useState(null);
  const scrollProgressRef = useRef(null);
  const page3DTransitionRef = useRef(null);

  // Track responsive screen size (mobile vs desktop)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Lenis Smooth Scrolling & GSAP ScrollTrigger ticker integration
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const lenis = new Lenis({
      duration: isTouch ? 0.6 : 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      syncTouch: false, // Prevents scroll hijacking / stutter on touch screens
    });

    setLenisRef(lenis);
    window.lenis = lenis; // Expose globally for modals to stop/start smooth scroll

    let rafProgressId;
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      if (scrollProgressRef.current) {
        if (rafProgressId) cancelAnimationFrame(rafProgressId);
        rafProgressId = requestAnimationFrame(() => {
          if (scrollProgressRef.current) {
            const progress = e.scroll / (document.documentElement.scrollHeight - window.innerHeight);
            scrollProgressRef.current.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
          }
        });
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Smooth lag adaptation instead of 0 to eliminate frame jumps/stutters
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      if (rafProgressId) cancelAnimationFrame(rafProgressId);
      delete window.lenis;
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Throttled Active section observer on scroll
  useEffect(() => {
    const sections = ['work', 'contact'];
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (isMobile) {
            const sections = ['contact', 'work', 'about', 'hero'];
            const scrollPos = window.scrollY + window.innerHeight / 3;
            for (const sectionId of sections) {
              const el = document.getElementById(sectionId);
              if (el && scrollPos >= el.offsetTop - 80) {
                setActiveSection(sectionId);
                break;
              }
            }
            ticking = false;
            return;
          }

          if (window.scrollY < 120) {
            const isAbout = page3DTransitionRef.current?.currentView === 'about';
            setActiveSection(isAbout ? 'about' : 'hero');
            ticking = false;
            return;
          }

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
  }, [isMobile]);

  // Synchronize hash navigation with active section
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#about') {
        setActiveSection('about');
      } else if (hash === '#hero' || hash === '' || hash === '#') {
        setActiveSection('hero');
      } else if (hash === '#work') {
        setActiveSection('work');
      } else if (hash === '#contact') {
        setActiveSection('contact');
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  /**
   * Unified Navigation Orchestrator
   * Coordinates 3D transitions for Home <-> About and smooth scroll for other sections
   */
  const handleNavigation = (id) => {
    if (isMobile) {
      const targetId = id === 'hero' ? 'hero' : id;
      const el = document.getElementById(targetId);
      if (el) {
        if (lenisRef) {
          lenisRef.scrollTo(el, { offset: -60 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        if (lenisRef) lenisRef.scrollTo(0, { offset: 0 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setActiveSection(id);
      return;
    }

    if (id === 'hero') {
      if (page3DTransitionRef.current?.currentView === 'about') {
        page3DTransitionRef.current.transitionToHome();
        setActiveSection('hero');
      } else {
        if (lenisRef) {
          lenisRef.scrollTo(0, { offset: 0 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setActiveSection('hero');
      }
    } else if (id === 'about') {
      if (page3DTransitionRef.current?.currentView === 'home') {
        page3DTransitionRef.current.transitionToAbout();
        setActiveSection('about');
      } else {
        if (lenisRef) {
          lenisRef.scrollTo(0, { offset: 0 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setActiveSection('about');
      }
    } else {
      // id === 'work' or 'contact'
      const el = document.getElementById(id);
      if (el) {
        if (lenisRef) {
          lenisRef.scrollTo(el, { offset: -60 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setActiveSection(id);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#FFFFFF] font-sans selection:bg-[#FF9800] selection:text-black">
      {/* Scroll Progress Bar at very top */}
      <div
        ref={scrollProgressRef}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9800] via-[#FFB02E] to-[#FFA726] z-[100] origin-left shadow-[0_0_12px_#FF9800] pointer-events-none transform scale-x-0 transition-transform duration-75"
      />

      {/* Dynamic Animated Cinematic Background */}
      <CinematicBackground />

      {/* Interactive Glowing Cursor */}
      <CustomCursor />

      {/* Fixed Sticky Header Navbar */}
      <Navbar activeSection={activeSection} scrollToSection={handleNavigation} />

      {/* Main Page Content: Desktop Unified Transitions vs Clean Mobile Native Scroll */}
      <main className="relative z-10">
        {isMobile ? (
          <>
            <section id="hero">
              <Hero scrollToSection={handleNavigation} />
            </section>
            <About scrollToSection={handleNavigation} isMobile={true} />
            <Work isMobile={true} />
            <StoryStrip />
            <Contact />
          </>
        ) : (
          <>
            <Page3DTransition
              ref={page3DTransitionRef}
              onNavigate={handleNavigation}
              onViewChange={(view) => setActiveSection(view === 'home' ? 'hero' : 'about')}
              activeSection={activeSection}
              lenisRef={lenisRef}
            />
            <Work isMobile={false} />
            <StoryStrip />
            <Contact />
          </>
        )}
      </main>

      {/* Minimal Footer */}
      <Footer scrollToSection={handleNavigation} />
    </div>
  );
}
