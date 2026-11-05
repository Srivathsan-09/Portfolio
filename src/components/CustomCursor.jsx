import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const viewBadgeRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHovered = false;
    let isPhotoHovered = false;
    let isClicking = false;
    let isVisible = false;
    let animationFrameId;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        if (ringRef.current) ringRef.current.style.opacity = '1';
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }
    };

    const onMouseDown = () => {
      isClicking = true;
    };

    const onMouseUp = () => {
      isClicking = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (viewBadgeRef.current) viewBadgeRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (ringRef.current) ringRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    // High-performance event delegation for hover targets & photo view indicator
    const handleMouseOver = (e) => {
      const photoTarget = e.target.closest('[data-cursor="view"], .gallery-photo-card');
      isPhotoHovered = !!photoTarget;

      const target = e.target.closest('a, button, [role="button"], input, textarea, .hover-target');
      isHovered = !!target && !isPhotoHovered;
    };

    document.body.addEventListener('mouseover', handleMouseOver, { passive: true });

    const animate = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
        dotRef.current.style.opacity = isVisible && !isPhotoHovered ? '1' : '0';
      }

      if (viewBadgeRef.current) {
        if (isPhotoHovered && isVisible) {
          viewBadgeRef.current.style.opacity = '1';
          const scale = isClicking ? 0.9 : 1.0;
          viewBadgeRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
        } else {
          viewBadgeRef.current.style.opacity = '0';
          viewBadgeRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(0.5)`;
        }
      }

      if (ringRef.current) {
        if (isPhotoHovered) {
          ringRef.current.style.opacity = '0';
        } else {
          ringRef.current.style.opacity = isVisible ? '1' : '0';
          const scale = isClicking ? 0.8 : isHovered ? 1.5 : 1.0;
          ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
          ringRef.current.style.borderColor = isHovered ? 'rgba(255, 152, 0, 0.85)' : 'rgba(255, 152, 0, 0.45)';
          ringRef.current.style.backgroundColor = isHovered ? 'rgba(255, 176, 46, 0.12)' : 'transparent';
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Outer Glowing Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[1000000] w-8 h-8 rounded-full border border-[#FF9800]/50 shadow-[0_0_12px_rgba(255,152,0,0.3)] hidden md:block opacity-0 transform-gpu will-change-transform"
        style={{ transition: 'background-color 0.2s, border-color 0.2s, opacity 0.2s' }}
      />
      {/* Inner Glowing Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[1000000] w-2 h-2 bg-[#FF9800] rounded-full shadow-[0_0_8px_#FF9800] hidden md:block opacity-0 transform-gpu will-change-transform"
        style={{ transition: 'opacity 0.2s' }}
      />
      {/* Photographic VIEW Indicator Cursor Badge */}
      <div
        ref={viewBadgeRef}
        className="fixed top-0 left-0 pointer-events-none z-[1000000] hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-[#FF9800] text-black shadow-[0_0_25px_rgba(255,152,0,0.7)] opacity-0 transform-gpu will-change-transform"
        style={{ transition: 'opacity 0.2s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase">
          VIEW
        </span>
      </div>
    </>
  );
}
