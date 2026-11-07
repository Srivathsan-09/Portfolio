import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Aperture, ChevronDown } from 'lucide-react';

/**
 * PhotographyScrollRail Component
 *
 * A bespoke vertical camera focus-distance ruler & filmstrip frame-counter
 * running along the left margin of the viewport:
 * - Direct visual cue indicating scroll depth and remaining content to explore
 * - Precision camera lens ruler tick marks (Leica / Canon lens barrel aesthetic)
 * - 35mm Film Frame milestones: 01 HOME, 02 ABOUT, 03 WORK, 04 STORY, 05 CONTACT
 * - Smoothly sliding amber aperture reticle needle
 * - Clickable frame milestones with interactive glassmorphism tooltips
 * - Bottom "SCROLL TO EXPOSE" animated cue
 * - Responsive: Full interactive film gauge on desktop/tablet, ultra-sleek hairline on mobile
 */
export default function PhotographyScrollRail({
  activeSection = 'hero',
  scrollToSection,
  isMobile = false,
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const rafId = useRef(null);

  const sections = [
    { id: 'hero', num: '01', label: 'HOME', focal: '24mm' },
    { id: 'about', num: '02', label: 'ABOUT', focal: '35mm' },
    { id: 'work', num: '03', label: 'WORK', focal: '50mm' },
    { id: 'story', num: '04', label: 'STORY', focal: '85mm' },
    { id: 'contact', num: '05', label: 'CONTACT', focal: '135mm' },
  ];

  // Calculate continuous scroll progress mapped across all 5 sections
  const updateProgress = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = Math.max(1, docHeight - winHeight);

    // Continuous scroll ratio from 0 to 1
    const rawRatio = Math.max(0, Math.min(1, scrollY / maxScroll));

    // Enhance accuracy by checking active section position
    let computedProgress = rawRatio;

    if (!isMobile) {
      if (activeSection === 'hero' && scrollY <= 20) {
        computedProgress = 0;
      } else if (activeSection === 'about' && scrollY <= 20) {
        computedProgress = 0.25;
      } else {
        // Map smoothly across sections based on actual DOM elements
        const workEl = document.getElementById('work');
        const storyEl = document.getElementById('story');
        const contactEl = document.getElementById('contact');

        if (workEl && storyEl && contactEl) {
          const workTop = workEl.offsetTop;
          const storyTop = storyEl.offsetTop;
          const contactTop = contactEl.offsetTop;

          if (scrollY < workTop) {
            const p = Math.max(0, scrollY / Math.max(1, workTop));
            computedProgress = 0.25 + p * 0.25;
          } else if (scrollY < storyTop) {
            const p = (scrollY - workTop) / Math.max(1, storyTop - workTop);
            computedProgress = 0.50 + p * 0.25;
          } else if (scrollY < contactTop) {
            const p = (scrollY - storyTop) / Math.max(1, contactTop - storyTop);
            computedProgress = 0.75 + p * 0.25;
          } else {
            const p = Math.min(1, (scrollY - contactTop) / Math.max(1, maxScroll - contactTop));
            computedProgress = 0.75 + p * 0.25;
          }
        }
      }
    }

    setScrollProgress(Math.max(0, Math.min(1, computedProgress)));
  }, [activeSection, isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateProgress]);

  // Determine active index based on activeSection
  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <>
      {/* =========================================================================
          DESKTOP & TABLET VIEWPORT: Full 35mm Film Gauge & Focus Distance Ruler
         ========================================================================= */}
      <aside
        aria-label="Photography scroll progress & section navigation"
        className="fixed left-2.5 sm:left-3.5 lg:left-4 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center pointer-events-none select-none"
      >
        {/* Top Camera Aperture / Lens Header */}
        <div className="flex flex-col items-center gap-1 mb-2.5 opacity-70 hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 rounded-full bg-black/60 border border-white/15 flex items-center justify-center shadow-lg">
            <Aperture className="w-3.5 h-3.5 text-[#FF9800] animate-spin-slow" />
          </div>
          <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-[#FF9800]/90 uppercase">
            35MM
          </span>
        </div>

        {/* Central Filmstrip Gauge Rail Capsule */}
        <div className="relative w-7.5 lg:w-8 h-[330px] lg:h-[370px] rounded-full bg-[#0c0d12]/80 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex flex-col items-center justify-between py-3 px-1">
          {/* Subtle Film Perforation Sprocket Texture */}
          <div className="absolute inset-y-2 left-1.5 flex flex-col justify-between pointer-events-none opacity-20">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="w-1 h-1.5 rounded-[1px] bg-white block" />
            ))}
          </div>
          <div className="absolute inset-y-2 right-1.5 flex flex-col justify-between pointer-events-none opacity-20">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="w-1 h-1.5 rounded-[1px] bg-white block" />
            ))}
          </div>

          {/* Central Vertical Track Line */}
          <div className="relative w-[2px] h-full bg-white/10 rounded-full mx-auto overflow-hidden">
            {/* Glowing Amber Scroll Fill */}
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#FF9800] via-[#FFB02E] to-[#FFA726] rounded-full shadow-[0_0_10px_#FF9800] transition-all duration-100 ease-out"
              style={{ height: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>

          {/* Precision Lens Barrel Distance Ruler Ticks */}
          <div className="absolute inset-y-6 inset-x-0 flex flex-col justify-between pointer-events-none px-2.5">
            {[...Array(17)].map((_, i) => {
              const isMajor = i % 4 === 0;
              const isMedium = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`mx-auto rounded-full transition-colors ${
                    isMajor
                      ? 'w-3 h-[1.5px] bg-white/40'
                      : isMedium
                      ? 'w-2 h-[1px] bg-white/20'
                      : 'w-1 h-[1px] bg-white/10'
                  }`}
                />
              );
            })}
          </div>

          {/* Sliding Amber Focus Reticle Needle */}
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-75 ease-out flex items-center z-30"
            style={{
              top: `calc(12px + ${scrollProgress} * (100% - 24px))`,
            }}
          >
            {/* Horizontal Reticle Crosshair Wings */}
            <div className="w-6 h-[2px] bg-gradient-to-r from-transparent via-[#FF9800] to-transparent rounded-full shadow-[0_0_8px_#FF9800]" />
            {/* Center Glowing Focus Bead */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-[#FF9800] shadow-[0_0_12px_#FF9800]" />
          </div>

          {/* 5 Film Frame Milestones (Clickable Section Nodes) */}
          <div className="absolute inset-y-3 inset-x-0 flex flex-col justify-between items-center z-20 pointer-events-none">
            {sections.map((sec, idx) => {
              const isActive = activeIndex === idx;
              const isPast = scrollProgress >= idx * 0.25 - 0.05;

              return (
                <div
                  key={sec.id}
                  className="relative flex items-center justify-center pointer-events-auto"
                  onMouseEnter={() => setHoveredNode(sec.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <button
                    onClick={() => scrollToSection?.(sec.id)}
                    aria-label={`Jump to ${sec.label} section`}
                    className={`group relative flex items-center justify-center p-1 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive ? 'scale-115' : 'hover:scale-110'
                    }`}
                  >
                    {/* Outer Focus Target Ring */}
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'border border-[#FF9800] bg-black shadow-[0_0_12px_rgba(255,152,0,0.6)]'
                          : isPast
                          ? 'border border-[#FF9800]/50 bg-black/60'
                          : 'border border-white/20 bg-black/60 group-hover:border-white/60'
                      }`}
                    >
                      {/* Center Node Core */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-[#FF9800] scale-110 shadow-[0_0_8px_#FF9800]'
                            : isPast
                            ? 'bg-[#FF9800]/70'
                            : 'bg-white/30 group-hover:bg-white/80'
                        }`}
                      />
                    </span>
                  </button>

                  {/* Interactive Slide-Out Glassmorphic Tooltip */}
                  <div
                    className={`absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#0a0a0e]/95 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-2 pointer-events-none transition-all duration-200 z-50 ${
                      hoveredNode === sec.id
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-2'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-[#FF9800]">
                      {sec.num}
                    </span>
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-white uppercase whitespace-nowrap">
                      {sec.label}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 border-l border-white/10 pl-1.5">
                      {sec.focal}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom "SCROLL" Photography Cue */}
        <div className="flex flex-col items-center gap-1 mt-2.5 opacity-75 hover:opacity-100 transition-opacity">
          {scrollProgress < 0.94 ? (
            <>
              <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-[#FF9800] uppercase">
                SCROLL
              </span>
              <div className="w-5 h-5 rounded-full bg-black/60 border border-[#FF9800]/30 flex items-center justify-center animate-bounce">
                <ChevronDown className="w-3 h-3 text-[#FF9800]" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono tracking-widest text-[#FF9800]/90 uppercase">
                EXPOSED
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF9800] mt-1 shadow-[0_0_8px_#FF9800]" />
            </div>
          )}
        </div>
      </aside>

      {/* =========================================================================
          MOBILE VIEWPORT: Ultra-Sleek 2px Minimalist Edge Filmstrip
         ========================================================================= */}
      <aside
        aria-label="Mobile scroll progress"
        className="fixed left-1.5 top-1/2 -translate-y-1/2 z-40 sm:hidden flex flex-col items-center pointer-events-none select-none"
      >
        <div className="relative w-1.5 h-[220px] rounded-full bg-[#0c0d12]/80 backdrop-blur-md border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between py-1">
          {/* Mobile Fill Line */}
          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#FF9800] via-[#FFB02E] to-[#FFA726] rounded-full shadow-[0_0_8px_#FF9800] transition-all duration-75 ease-out"
            style={{ height: `${Math.round(scrollProgress * 100)}%` }}
          />

          {/* 5 Milestone Dots */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full mx-auto relative z-10 transition-colors ${
                scrollProgress >= i * 0.25 - 0.05
                  ? 'bg-white shadow-[0_0_4px_#FF9800]'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

