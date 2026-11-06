import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import gsap from 'gsap';
import Hero from './Hero';
import About from './About';

/**
 * Optimized Cinematic 3D Page Transition Component
 *
 * Performance-tuned physical 3D layer movement between Home and About:
 * - Ultra-responsive transition times (0.82s departure, 0.72s return)
 * - GPU-composited shadow opacity instead of expensive dynamic blur filters
 * - Dynamic willChange allocation that frees GPU memory on completion
 * - Demand-driven rendering and instant accessibility fallback
 */
const Page3DTransition = forwardRef(function Page3DTransition(
  { onNavigate, lenisRef },
  ref
) {
  const stageRef = useRef(null);
  const homeLayerRef = useRef(null);
  const homeShadowRef = useRef(null);
  const aboutLayerRef = useRef(null);
  const shadowOverlayRef = useRef(null);
  const aboutComponentRef = useRef(null);

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#about') {
      return 'about';
    }
    return 'home';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initial layout configuration on mount
  useEffect(() => {
    const isAbout = currentView === 'about';
    if (isAbout) {
      if (homeLayerRef.current) {
        homeLayerRef.current.style.display = 'none';
        homeLayerRef.current.style.pointerEvents = 'none';
      }
      if (aboutLayerRef.current) {
        gsap.set(aboutLayerRef.current, { z: 0, scale: 1.0, opacity: 1 });
      }
      if (shadowOverlayRef.current) {
        gsap.set(shadowOverlayRef.current, { opacity: 0 });
      }
      setTimeout(() => {
        aboutComponentRef.current?.playReveal?.();
      }, 50);
    } else {
      if (homeLayerRef.current) {
        homeLayerRef.current.style.display = 'block';
        homeLayerRef.current.style.pointerEvents = 'auto';
        gsap.set(homeLayerRef.current, {
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          opacity: 1,
        });
      }
      if (homeShadowRef.current) {
        gsap.set(homeShadowRef.current, { opacity: 0 });
      }
      if (aboutLayerRef.current) {
        gsap.set(aboutLayerRef.current, { z: -80, scale: 0.96, opacity: 0.7 });
      }
      if (shadowOverlayRef.current) {
        gsap.set(shadowOverlayRef.current, { opacity: 0.65 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * High-Performance Cinematic 3D Home Exit Transition -> Reveal About (0.82s)
   */
  const transitionToAbout = useCallback(
    (callback) => {
      if (isTransitioning || currentView === 'about') {
        if (callback) callback();
        return;
      }

      setIsTransitioning(true);

      if (homeLayerRef.current) {
        homeLayerRef.current.style.pointerEvents = 'none';
        homeLayerRef.current.style.willChange = 'transform, opacity';
      }
      if (aboutLayerRef.current) {
        aboutLayerRef.current.style.willChange = 'transform, opacity';
      }

      // Scroll to top cleanly before initiating 3D perspective animation
      if (window.scrollY > 0) {
        if (lenisRef) {
          lenisRef.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isReduced) {
        gsap.to(homeLayerRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: () => {
            if (homeLayerRef.current) {
              homeLayerRef.current.style.display = 'none';
              homeLayerRef.current.style.willChange = 'auto';
            }
            if (aboutLayerRef.current) {
              aboutLayerRef.current.style.willChange = 'auto';
            }
            setCurrentView('about');
            setIsTransitioning(false);
            window.history.pushState(null, '', '#about');
            aboutComponentRef.current?.playReveal?.();
            if (callback) callback();
          },
        });
        return;
      }

      // Pause Lenis smooth scroll during physical 3D flight to prevent stutter
      lenisRef?.stop();

      const tl = gsap.timeline({
        onComplete: () => {
          if (homeLayerRef.current) {
            homeLayerRef.current.style.display = 'none';
            homeLayerRef.current.style.willChange = 'auto';
          }
          if (aboutLayerRef.current) {
            aboutLayerRef.current.style.willChange = 'auto';
          }
          setCurrentView('about');
          setIsTransitioning(false);
          window.history.pushState(null, '', '#about');
          lenisRef?.start();
          if (callback) callback();
        },
      });

      // 1. HOME EXIT: Phase 1 — Physical 3D Lift & Initial Tilt (0.0s - 0.24s)
      tl.to(
        homeLayerRef.current,
        {
          z: 85,
          y: -16,
          rotationX: 7,
          rotationY: -10,
          rotationZ: 2,
          duration: 0.24,
          ease: 'power2.out',
        },
        0
      );

      // Fast GPU shadow opacity reveal
      if (homeShadowRef.current) {
        tl.to(
          homeShadowRef.current,
          {
            opacity: 1,
            duration: 0.22,
            ease: 'power2.out',
          },
          0
        );
      }

      // 2. HOME EXIT: Phase 2 — Diagonal Acceleration & Clean Flight Out (0.24s - 0.82s)
      tl.to(
        homeLayerRef.current,
        {
          x: '125vw',
          y: '-50vh',
          z: 320,
          rotationX: 22,
          rotationY: -30,
          rotationZ: 9,
          duration: 0.58,
          ease: 'power3.in',
        },
        0.24
      );

      // Opacity fade during final leg of flight
      tl.to(
        homeLayerRef.current,
        {
          opacity: 0,
          duration: 0.28,
          ease: 'power1.out',
        },
        0.54
      );

      // 3. ABOUT ENTRANCE: Rises from 3D depth smoothly (0.20s - 0.80s)
      tl.to(
        aboutLayerRef.current,
        {
          z: 0,
          scale: 1.0,
          opacity: 1.0,
          duration: 0.62,
          ease: 'power3.out',
        },
        0.20
      );

      // Dissolve ambient shadow overlay
      if (shadowOverlayRef.current) {
        tl.to(
          shadowOverlayRef.current,
          {
            opacity: 0,
            duration: 0.48,
            ease: 'power2.out',
          },
          0.18
        );
      }

      // 4. ABOUT CONTENT: Staggered reveal triggered promptly at 0.28s
      tl.add(() => {
        aboutComponentRef.current?.playReveal?.();
      }, 0.28);
    },
    [currentView, isTransitioning, lenisRef]
  );

  /**
   * High-Performance Cinematic 3D Home Return Transition (About -> Home) (0.72s)
   */
  const transitionToHome = useCallback(
    (callback) => {
      if (isTransitioning || currentView === 'home') {
        if (callback) callback();
        return;
      }

      setIsTransitioning(true);

      if (homeLayerRef.current) {
        homeLayerRef.current.style.display = 'block';
        homeLayerRef.current.style.pointerEvents = 'none';
        homeLayerRef.current.style.willChange = 'transform, opacity';
      }
      if (aboutLayerRef.current) {
        aboutLayerRef.current.style.willChange = 'transform, opacity';
      }

      if (window.scrollY > 0) {
        if (lenisRef) {
          lenisRef.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isReduced) {
        gsap.fromTo(
          homeLayerRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.25,
            ease: 'power2.out',
            onComplete: () => {
              if (homeLayerRef.current) {
                homeLayerRef.current.style.pointerEvents = 'auto';
                homeLayerRef.current.style.willChange = 'auto';
              }
              if (aboutLayerRef.current) {
                aboutLayerRef.current.style.willChange = 'auto';
              }
              setCurrentView('home');
              setIsTransitioning(false);
              window.history.pushState(null, '', '#hero');
              if (callback) callback();
            },
          }
        );
        return;
      }

      lenisRef?.stop();

      // Position Home at offscreen diagonal flight position
      gsap.set(homeLayerRef.current, {
        x: '125vw',
        y: '-50vh',
        z: 320,
        rotationX: 22,
        rotationY: -30,
        rotationZ: 9,
        opacity: 0,
      });

      if (homeShadowRef.current) {
        gsap.set(homeShadowRef.current, { opacity: 1 });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (homeLayerRef.current) {
            homeLayerRef.current.style.pointerEvents = 'auto';
            homeLayerRef.current.style.willChange = 'auto';
          }
          if (aboutLayerRef.current) {
            aboutLayerRef.current.style.willChange = 'auto';
          }
          setCurrentView('home');
          setIsTransitioning(false);
          window.history.pushState(null, '', '#hero');
          lenisRef?.start();
          if (callback) callback();
        },
      });

      // About recedes into 3D depth
      tl.to(
        aboutLayerRef.current,
        {
          z: -80,
          scale: 0.96,
          opacity: 0.7,
          duration: 0.62,
          ease: 'power2.inOut',
        },
        0
      );

      if (shadowOverlayRef.current) {
        tl.to(
          shadowOverlayRef.current,
          {
            opacity: 0.65,
            duration: 0.55,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // Home flies back into viewport
      tl.to(
        homeLayerRef.current,
        {
          x: 0,
          y: -16,
          z: 85,
          rotationX: 7,
          rotationY: -10,
          rotationZ: 2,
          opacity: 1,
          duration: 0.52,
          ease: 'power3.out',
        },
        0.05
      );

      // Home settles down onto surface
      tl.to(
        homeLayerRef.current,
        {
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          duration: 0.28,
          ease: 'power2.inOut',
        },
        0.50
      );

      if (homeShadowRef.current) {
        tl.to(
          homeShadowRef.current,
          {
            opacity: 0,
            duration: 0.24,
            ease: 'power2.inOut',
          },
          0.52
        );
      }
    },
    [currentView, isTransitioning, lenisRef]
  );

  // Expose transition controls to parent (App)
  useImperativeHandle(
    ref,
    () => ({
      transitionToAbout,
      transitionToHome,
      currentView,
      isTransitioning,
    }),
    [currentView, isTransitioning, transitionToAbout, transitionToHome]
  );

  // Browser Back / Forward navigation handling (popstate / hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      if (hash === '#about' && currentView === 'home' && !isTransitioning) {
        transitionToAbout();
      } else if (
        (hash === '#hero' || hash === '' || hash === '#') &&
        currentView === 'about' &&
        !isTransitioning
      ) {
        transitionToHome();
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [currentView, isTransitioning, transitionToAbout, transitionToHome]);

  // Scroll down / touch swipe gesture on Home to trigger physical 3D departure
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e) => {
      if (currentView === 'home' && !isTransitioning && e.deltaY > 30 && window.scrollY <= 10) {
        transitionToAbout();
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (currentView === 'home' && !isTransitioning && window.scrollY <= 10) {
        const touchCurrentY = e.touches[0].clientY;
        if (touchStartY - touchCurrentY > 45) {
          transitionToAbout();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentView, isTransitioning, transitionToAbout]);

  return (
    <div
      ref={stageRef}
      className="relative w-full overflow-hidden select-none"
      style={{
        perspective: '1400px',
        perspectiveOrigin: '50% 40%',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="grid grid-cols-1 grid-rows-1 w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* UNDERNEATH 3D LAYER: About Page */}
        <div
          ref={aboutLayerRef}
          className="col-start-1 row-start-1 w-full relative"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <About
            ref={aboutComponentRef}
            scrollToSection={onNavigate}
            isLayer={true}
          />

          {/* Ambient shadow overlay representing depth underneath Home layer */}
          <div
            ref={shadowOverlayRef}
            className="absolute inset-0 bg-[#080808] pointer-events-none z-30 transition-opacity duration-300"
          />
        </div>

        {/* TOP 3D LAYER: Home Page Surface */}
        <div
          ref={homeLayerRef}
          className="col-start-1 row-start-1 w-full z-20 relative"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '35% 65%',
            backfaceVisibility: 'hidden',
          }}
        >
          <Hero scrollToSection={onNavigate} />

          {/* GPU-composited drop shadow layer during 3D lift */}
          <div
            ref={homeShadowRef}
            className="absolute inset-0 pointer-events-none opacity-0 shadow-[0_50px_120px_-20px_rgba(0,0,0,0.95),0_0_50px_rgba(255,152,0,0.2)] rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
});

export default Page3DTransition;
