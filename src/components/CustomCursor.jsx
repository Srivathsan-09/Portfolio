import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailPosition, setTrailPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const handleHoverElements = () => {
      const hoverables = document.querySelectorAll('a, button, [role="button"], input, textarea, .hover-target');
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    handleHoverElements();
    const observer = new MutationObserver(handleHoverElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    const followCursor = () => {
      setTrailPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18,
      }));
      animationFrameId = requestAnimationFrame(followCursor);
    };
    followCursor();
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Glowing Ring */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full transition-transform duration-200 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          left: `${trailPosition.x}px`,
          top: `${trailPosition.y}px`,
          width: isHovered ? '48px' : '28px',
          height: isHovered ? '48px' : '28px',
          border: '1px solid rgba(217, 70, 239, 0.5)',
          backgroundColor: isHovered ? 'rgba(168, 85, 247, 0.08)' : 'transparent',
          boxShadow: isHovered ? '0 0 20px rgba(217, 70, 239, 0.4)' : '0 0 10px rgba(168, 85, 247, 0.2)',
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
        }}
      />
      {/* Inner Glowing Center Dot */}
      <div
        className="fixed pointer-events-none z-[9999] w-2 h-2 bg-[#D946EF] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#D946EF] hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
}
