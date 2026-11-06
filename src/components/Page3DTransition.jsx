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
 * Cinematic 3D Page Transition Component
 *
 * Orchestrates physical 3D layer movement between Home and About:
 * - Home behaves as a physical 3D surface sitting over About
 * - When transitioning to About: Home lifts, tilts on X and Y, and flies diagonally out in perspective
 * - About is revealed smoothly underneath with depth elevation and staggered content unveiling
 * - Seamless reverse physics when navigating back to Home
 * - Full support for browser back/forward history and reduced motion accessibility
 */
const Page3DTransition = forwardRef(function Page3DTransition(
  { onNavigate, lenisRef },
  ref
) {
  const stageRef = useRef(null);
  const homeLayerRef = useRef(null);
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
      }, 100);
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
          boxShadow: 'none',
        });
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
   * Cinematic 3D Home Exit Transition -> Reveal About
   */
  const transitionToAbout = useCallback(
    (callback) => {
      if (isTransitioning || currentView === 'about') {
        if (callback) callback();
        return;
      }

      setIsTransitioning(true);

      // Disable interaction with outgoing Home layer
      if (homeLayerRef.current) {
        homeLayerRef.current.style.pointerEvents = 'none';
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
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            if (homeLayerRef.current) {
              homeLayerRef.current.style.display = 'none';
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

      // Pause Lenis smooth scroll during physical 3D flight to eliminate any scroll jump
      lenisRef?.stop();

      const tl = gsap.timeline({
        onComplete: () => {
          if (homeLayerRef.current) {
            homeLayerRef.current.style.display = 'none';
          }
          setCurrentView('about');
          setIsTransitioning(false);
          window.history.pushState(null, '', '#about');
          lenisRef?.start();
          if (callback) callback();
        },
      });

      // 1. HOME EXIT: Phase 1 — Physical 3D Lift & Initial Tilt (0.0s - 0.38s)
      tl.to(
        homeLayerRef.current,
        {
          z: 90,
          y: -20,
          rotationX: 7.5,
          rotationY: -10.5,
          rotationZ: 2.2,
          boxShadow: '0 60px 140px -20px rgba(0, 0, 0, 0.95), 0 0 60px rgba(255, 152, 0, 0.22)',
          duration: 0.38,
          ease: 'power2.out',
        },
        0
      );

      // 2. HOME EXIT: Phase 2 — Diagonal Acceleration & Flight Out (0.38s - 1.25s)
      tl.to(
        homeLayerRef.current,
        {
          x: '125vw',
          y: '-52vh',
          z: 340,
          rotationX: 24,
          rotationY: -32,
          rotationZ: 9.5,
          duration: 0.88,
          ease: 'power3.in',
        },
        0.38
      );

      // Smooth opacity fade towards the final leg of flight
      tl.to(
        homeLayerRef.current,
        {
          opacity: 0,
          duration: 0.42,
          ease: 'power1.out',
        },
        0.82
      );

      // 3. ABOUT ENTRANCE: Rises from 3D depth smoothly (0.30s - 1.15s)
      tl.to(
        aboutLayerRef.current,
        {
          z: 0,
          scale: 1.0,
          opacity: 1.0,
          duration: 0.88,
          ease: 'power3.out',
        },
        0.3
      );

      // Dissolve ambient shadow overlay
      if (shadowOverlayRef.current) {
        tl.to(
          shadowOverlayRef.current,
          {
            opacity: 0,
            duration: 0.65,
            ease: 'power2.out',
          },
          0.28
        );
      }

      // 4. ABOUT CONTENT: Staggered reveal of section tag, heading, portrait, text, quote, CTA
      tl.add(() => {
        aboutComponentRef.current?.playReveal?.();
      }, 0.48);
    },
    [currentView, isTransitioning, lenisRef]
  );

  /**
   * Cinematic 3D Home Return Transition (About -> Home)
   */
  const transitionToHome = useCallback(
    (callback) => {
      if (isTransitioning || currentView === 'home') {
        if (callback) callback();
        return;
      }

      setIsTransitioning(true);

      // Make home layer visible again offscreen
      if (homeLayerRef.current) {
        homeLayerRef.current.style.display = 'block';
        homeLayerRef.current.style.pointerEvents = 'none';
      }

      // Scroll to top cleanly
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
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              if (homeLayerRef.current) {
                homeLayerRef.current.style.pointerEvents = 'auto';
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
        y: '-52vh',
        z: 340,
        rotationX: 24,
        rotationY: -32,
        rotationZ: 9.5,
        opacity: 0,
        boxShadow: '0 60px 140px -20px rgba(0, 0, 0, 0.95), 0 0 60px rgba(255, 152, 0, 0.22)',
      });

      const tl = gsap.timeline({
        onComplete: () => {
          if (homeLayerRef.current) {
            homeLayerRef.current.style.pointerEvents = 'auto';
          }
          setCurrentView('home');
          setIsTransitioning(false);
          window.history.pushState(null, '', '#hero');
          lenisRef?.start();
          if (callback) callback();
        },
      });

      // About recedes back into 3D depth
      tl.to(
        aboutLayerRef.current,
        {
          z: -80,
          scale: 0.96,
          opacity: 0.7,
          duration: 0.85,
          ease: 'power2.inOut',
        },
        0
      );

      // Shadow overlay fades back over About
      if (shadowOverlayRef.current) {
        tl.to(
          shadowOverlayRef.current,
          {
            opacity: 0.65,
            duration: 0.75,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // Home flies back into viewport with reverse perspective
      tl.to(
        homeLayerRef.current,
        {
          x: 0,
          y: -20,
          z: 90,
          rotationX: 7.5,
          rotationY: -10.5,
          rotationZ: 2.2,
          opacity: 1,
          duration: 0.84,
          ease: 'power3.out',
        },
        0.08
      );

      // Home gently settles down onto surface and shadow tightens
      tl.to(
        homeLayerRef.current,
        {
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          boxShadow: 'none',
          duration: 0.42,
          ease: 'power2.inOut',
        },
        0.88
      );
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
            willChange: 'transform, opacity',
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
            willChange: 'transform, opacity, box-shadow',
            backfaceVisibility: 'hidden',
          }}
        >
          <Hero scrollToSection={onNavigate} />
        </div>
      </div>
    </div>
  );
});

export default Page3DTransition;
