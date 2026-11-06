import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { gsap } from 'gsap';
import AboutDisintegration from './AboutDisintegration';

/**
 * About Component
 * Renders the About section with integrated 3D Box Disintegration transition into Work:
 * - Forward ref supports programmatic reveal when navigating from Home
 * - Coordinates content refs for stagger animations
 * - Delegates to AboutDisintegration for the interactive scroll-linked 3D tile shatter
 */
const About = forwardRef(function About({ scrollToSection, isLayer = false }, ref) {
  const tagRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const quoteRef = useRef(null);
  const ctaRef = useRef(null);
  const bgWrapperRef = useRef(null);

  /**
   * Programmatic Staggered Content Reveal
   * Invoked when revealed via the 3D page transition or direct navigation
   */
  const playReveal = () => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const targets = [
      tagRef.current,
      headingRef.current,
      textRef.current,
      quoteRef.current,
      ctaRef.current,
    ].filter(Boolean);

    if (targets.length > 0) {
      gsap.fromTo(
        targets,
        { y: 20, opacity: 0.4 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out' }
      );
    }
  };

  const resetReveal = () => {
    const targets = [
      tagRef.current,
      headingRef.current,
      textRef.current,
      quoteRef.current,
      ctaRef.current,
    ].filter(Boolean);

    if (targets.length > 0) {
      gsap.set(targets, { opacity: 1, y: 0, x: 0 });
    }
  };

  useImperativeHandle(ref, () => ({
    playReveal,
    resetReveal,
  }));

  return (
    <AboutDisintegration
      ref={ref}
      scrollToSection={scrollToSection}
      isLayer={isLayer}
      tagRef={tagRef}
      headingRef={headingRef}
      textRef={textRef}
      quoteRef={quoteRef}
      ctaRef={ctaRef}
      bgWrapperRef={bgWrapperRef}
    />
  );
});

export default About;
