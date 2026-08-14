import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHovered = false;
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

    // High-performance event delegation for hover targets
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, textarea, .hover-target');
      isHovered = !!target;
    };

    document.body.addEventListener('mouseover', handleMouseOver, { passive: true });

    const animate = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        const scale = isClicking ? 0.8 : isHovered ? 1.5 : 1.0;
        ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.borderColor = isHovered ? 'rgba(217, 70, 239, 0.8)' : 'rgba(217, 70, 239, 0.45)';
        ringRef.current.style.backgroundColor = isHovered ? 'rgba(168, 85, 247, 0.12)' : 'transparent';
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
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-8 h-8 rounded-full border border-[#D946EF]/50 shadow-[0_0_12px_rgba(217,70,239,0.3)] hidden md:block opacity-0 transform-gpu will-change-transform"
        style={{ transition: 'width 0.2s, height 0.2s, background-color 0.2s, border-color 0.2s, opacity 0.2s' }}
      />
      {/* Inner Glowing Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 bg-[#D946EF] rounded-full shadow-[0_0_8px_#D946EF] hidden md:block opacity-0 transform-gpu will-change-transform"
        style={{ transition: 'opacity 0.2s' }}
      />
    </>
  );
}
