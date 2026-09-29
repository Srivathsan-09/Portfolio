import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, X, ZoomIn, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D Interactive Tilt Card Component for Main Work Section
function Interactive3DCard({ card, num, title, image, offsetY, onClick, innerRef }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const glareRef = useRef(null);
  const contentRef = useRef(null);
  const rafId = useRef(null);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const cardEl = cardRef.current;
      if (!cardEl) return;

      const rect = cardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;

      cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

      if (imgRef.current) {
        const moveX = ((x - centerX) / centerX) * -18;
        const moveY = ((y - centerY) / centerY) * -18;
        imgRef.current.style.transform = `scale(1.15) translate3d(${moveX}px, ${moveY}px, 20px)`;
      }

      if (contentRef.current) {
        const textX = ((x - centerX) / centerX) * 8;
        const textY = ((y - centerY) / centerY) * 8;
        contentRef.current.style.transform = `translate3d(${textX}px, ${textY}px, 40px)`;
      }

      if (glareRef.current) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(217, 70, 239, 0.35), rgba(255, 154, 60, 0.15) 40%, transparent 70%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const cardEl = cardRef.current;
    if (!cardEl) return;

    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    cardEl.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

    if (imgRef.current) {
      imgRef.current.style.transform = 'scale(1.05) translate3d(0px, 0px, 0px)';
      imgRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    if (contentRef.current) {
      contentRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
      contentRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  const handleMouseEnter = () => {
    if (cardRef.current) cardRef.current.style.transition = 'none';
    if (imgRef.current) imgRef.current.style.transition = 'none';
    if (contentRef.current) contentRef.current.style.transition = 'none';
  };

  return (
    <div
      ref={(el) => {
        cardRef.current = el;
        if (innerRef) innerRef(el);
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative aspect-[3/4] rounded-3xl overflow-hidden card-border-glow cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${offsetY} transform-gpu transition-all duration-300 preserve-3d`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <img
        ref={imgRef}
        src={image}
        alt={`Srivathsan ${title} photography`}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover object-center transform-gpu transition-transform duration-500 ease-out"
      />

      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-20 mix-blend-screen"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#03050B] via-[#03050B]/30 to-transparent opacity-85 group-hover:opacity-70 transition-opacity pointer-events-none" />

      <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-[#D946EF] group-hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all pointer-events-none" />

      <div
        ref={contentRef}
        className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-30 pointer-events-none transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-mono text-[#D946EF] font-bold drop-shadow-[0_0_8px_#D946EF] group-hover:scale-110 transition-transform">
            {num}
          </span>
          <h3 className="font-oswald text-xl sm:text-2xl font-bold text-white tracking-wide uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#FF9A3C] transition-all">
            {title}
          </h3>
        </div>

        <div className="w-9 h-9 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:text-white group-hover:border-[#D946EF] group-hover:bg-[#D946EF]/30 group-hover:shadow-[0_0_15px_#D946EF] group-hover:scale-110 transition-all">
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

// Optimized 3D Interactive Animated Card for Modal Gallery Grid (Landscape for EVENTS, Portrait for others)
function ModalGalleryCard({ item, onClick }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const glareRef = useRef(null);
  const contentRef = useRef(null);
  const rafId = useRef(null);

  const isLandscape = item.category === 'EVENTS';
  const aspectClass = isLandscape ? 'aspect-[16/10]' : 'aspect-[3/4]';

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const cardEl = cardRef.current;
      if (!cardEl) return;

      const rect = cardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

      if (imgRef.current) {
        const moveX = ((x - centerX) / centerX) * -12;
        const moveY = ((y - centerY) / centerY) * -12;
        imgRef.current.style.transform = `scale(1.1) translate3d(${moveX}px, ${moveY}px, 12px)`;
      }

      if (contentRef.current) {
        const textX = ((x - centerX) / centerX) * 5;
        const textY = ((y - centerY) / centerY) * 5;
        contentRef.current.style.transform = `translate3d(${textX}px, ${textY}px, 28px)`;
      }

      if (glareRef.current) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(217, 70, 239, 0.35), rgba(255, 154, 60, 0.15) 45%, transparent 70%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const cardEl = cardRef.current;
    if (!cardEl) return;

    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    cardEl.style.transition = 'transform 0.4s ease-out';

    if (imgRef.current) {
      imgRef.current.style.transform = 'scale(1.0) translate3d(0px, 0px, 0px)';
      imgRef.current.style.transition = 'transform 0.4s ease-out';
    }

    if (contentRef.current) {
      contentRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
      contentRef.current.style.transition = 'transform 0.4s ease-out';
    }

    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  const handleMouseEnter = () => {
    if (cardRef.current) cardRef.current.style.transition = 'none';
    if (imgRef.current) imgRef.current.style.transition = 'none';
    if (contentRef.current) contentRef.current.style.transition = 'none';
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${aspectClass} rounded-2xl overflow-hidden border border-white/10 cursor-pointer group card-border-glow bg-black/40 shadow-2xl transform-gpu transition-all duration-300 preserve-3d animate-fadeIn`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <img
        ref={imgRef}
        src={item.src}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transform-gpu transition-transform duration-500 ease-out"
      />

      {/* Dynamic Specular Glare Layer */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-20 mix-blend-screen"
      />

      {/* Glowing Neon Border Ring */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-[#D946EF] group-hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all pointer-events-none" />
    </div>
  );
}

// Interactive Rotating Camera Aperture Wheel Component
function ApertureWheel({ categories, activeIndex, onSelectCategory, openGalleryModal }) {
  const wheelRef = useRef(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startAngleRef = useRef(0);
  const currentRotationRef = useRef(0);

  // Smooth Device Orientation / Gyroscope Tilt rotation on mobile phones
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.gamma !== undefined) {
        const tiltAngle = Math.min(Math.max(e.gamma, -45), 45) * 1.6;
        setRotationAngle((prev) => prev + (tiltAngle - prev) * 0.15);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  useEffect(() => {
    currentRotationRef.current = rotationAngle;
  }, [rotationAngle]);

  // Pointer & Drag Physics
  const getAngleFromEvent = (e) => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    startAngleRef.current = getAngleFromEvent(e) - currentRotationRef.current;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const angle = getAngleFromEvent(e);
    const newAngle = angle - startAngleRef.current;
    setRotationAngle(newAngle);

    const segmentAngle = 360 / categories.length; // 72deg
    const normalized = ((-newAngle % 360) + 360) % 360;
    const newIndex = Math.floor(((normalized + segmentAngle / 2) % 360) / segmentAngle) % categories.length;
    onSelectCategory(newIndex);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const segmentAngle = 360 / categories.length;
    const snappedAngle = Math.round(rotationAngle / segmentAngle) * segmentAngle;
    setRotationAngle(snappedAngle);

    const normalized = ((-snappedAngle % 360) + 360) % 360;
    const newIndex = Math.floor(((normalized + segmentAngle / 2) % 360) / segmentAngle) % categories.length;
    onSelectCategory(newIndex);
  };

  const activeCategory = categories[activeIndex] || categories[0];

  // Helper to draw SVG Sector Arc Path
  const describeArc = (x, y, innerRadius, outerRadius, startAngle, endAngle) => {
    const rad = (angle) => (angle - 90) * (Math.PI / 180);
    const x1Outer = x + outerRadius * Math.cos(rad(startAngle));
    const y1Outer = y + outerRadius * Math.sin(rad(startAngle));
    const x2Outer = x + outerRadius * Math.cos(rad(endAngle));
    const y2Outer = y + outerRadius * Math.sin(rad(endAngle));

    const x1Inner = x + innerRadius * Math.cos(rad(endAngle));
    const y1Inner = y + innerRadius * Math.sin(rad(endAngle));
    const x2Inner = x + innerRadius * Math.cos(rad(startAngle));
    const y2Inner = y + innerRadius * Math.sin(rad(startAngle));

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${x1Outer} ${y1Outer}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
      `L ${x1Inner} ${y1Inner}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}`,
      'Z',
    ].join(' ');
  };

  // Helper to draw SVG Arc Line for Curved Text Path
  const describeTextArc = (x, y, radius, startAngle, endAngle) => {
    const rad = (angle) => (angle - 90) * (Math.PI / 180);
    const x1 = x + radius * Math.cos(rad(startAngle));
    const y1 = y + radius * Math.sin(rad(startAngle));
    const x2 = x + radius * Math.cos(rad(endAngle));
    const y2 = y + radius * Math.sin(rad(endAngle));

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  const lensStops = ['f/1.4', '35mm', 'f/2.8', '50mm', 'f/5.6', '85mm', 'f/11', '135mm', 'f/16', 'f/22'];

  const numSectors = categories.length;
  const segmentAngle = 360 / numSectors;

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[540px] mx-auto py-2">
      {/* Outer Radial Ambient Light Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#D946EF]/25 via-[#A855F7]/15 to-[#FF9A3C]/25 rounded-full blur-[120px] pointer-events-none transform scale-110" />

      {/* Rotating Wheel Graphic Container */}
      <div
        ref={wheelRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className="relative w-[340px] h-[340px] sm:w-[410px] sm:h-[410px] lg:w-[470px] lg:h-[470px] xl:w-[510px] xl:h-[510px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      >
        {/* SVG Camera Lens Aperture Ring, Sector Arcs, Curved Text & Lens Markings */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full transform-gpu">
          <defs>
            <radialGradient id="activeSectorGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D946EF" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#A855F7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FF9A3C" stopOpacity="0.05" />
            </radialGradient>
            <radialGradient id="inactiveSectorGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </radialGradient>

            {/* Dynamic Sector Arc Paths for SVG Curved Text */}
            {categories.map((_, idx) => {
              const startAngle = idx * segmentAngle;
              return (
                <path
                  key={`text-path-${idx}`}
                  id={`sectorTextArc-${idx}`}
                  d={describeTextArc(200, 200, 143, startAngle + 5, startAngle + segmentAngle - 5)}
                />
              );
            })}
          </defs>

          {/* Dynamic Sector Background Arcs (Clickable) */}
          {categories.map((_, idx) => {
            const startAngle = idx * segmentAngle;
            const isSelected = activeIndex === idx;
            const pathData = describeArc(200, 200, 96, 190, startAngle, startAngle + segmentAngle);
            return (
              <path
                key={idx}
                d={pathData}
                fill={isSelected ? 'url(#activeSectorGradient)' : 'url(#inactiveSectorGradient)'}
                stroke={isSelected ? 'rgba(217, 70, 239, 0.9)' : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={isSelected ? '2.5' : '1'}
                className="transition-all duration-300 cursor-pointer pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(idx);
                  setRotationAngle(-idx * segmentAngle);
                }}
              />
            );
          })}

          {/* Curved Category Labels along Sector Arcs */}
          {categories.map((cat, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <text
                key={cat.id}
                className="cursor-pointer pointer-events-auto select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(idx);
                  setRotationAngle(-idx * segmentAngle);
                }}
              >
                <textPath
                  href={`#sectorTextArc-${idx}`}
                  xlinkHref={`#sectorTextArc-${idx}`}
                  startOffset="50%"
                  textAnchor="middle"
                  className="font-oswald uppercase tracking-[0.16em] transition-all duration-300"
                >
                  <tspan
                    fill={isSelected ? '#FF9A3C' : '#D946EF'}
                    fontSize={isSelected ? '12.5' : '11'}
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {cat.num}{' '}
                  </tspan>
                  <tspan
                    fill={isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)'}
                    fontSize={isSelected ? '12.5' : '11'}
                    fontWeight={isSelected ? '700' : '600'}
                  >
                    {cat.title}
                  </tspan>
                </textPath>
              </text>
            );
          })}

          {/* Outer Boundary Camera Lens Rim */}
          <circle cx="200" cy="200" r="192" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="3" />
          <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(217, 70, 239, 0.4)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Lens Aperture Stop Ticks & Markings Around Rim */}
          {lensStops.map((stop, i) => {
            const angle = i * 36;
            const rad = (angle - 90) * (Math.PI / 180);
            const x1 = 200 + 185 * Math.cos(rad);
            const y1 = 200 + 185 * Math.sin(rad);
            const x2 = 200 + 192 * Math.cos(rad);
            const y2 = 200 + 192 * Math.sin(rad);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Inner Lens Hub Ring */}
          <circle cx="200" cy="200" r="96" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="3" />
          <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255, 154, 60, 0.5)" strokeWidth="1.5" />

          {/* Spoke Partition Lines */}
          {categories.map((_, idx) => {
            const angle = idx * segmentAngle;
            const rad = (angle - 90) * (Math.PI / 180);
            const x1 = 200 + 96 * Math.cos(rad);
            const y1 = 200 + 96 * Math.sin(rad);
            const x2 = 200 + 192 * Math.cos(rad);
            const y2 = 200 + 192 * Math.sin(rad);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Center Camera Viewfinder Iris */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            openGalleryModal(activeCategory.title);
          }}
          style={{ transform: `rotate(${-rotationAngle}deg)` }}
          className="absolute w-[155px] h-[155px] sm:w-[190px] sm:h-[190px] lg:w-[225px] lg:h-[225px] xl:w-[245px] xl:h-[245px] rounded-full overflow-hidden border-2 border-white/30 shadow-[0_0_35px_rgba(217,70,239,0.5)] cursor-pointer group transition-transform duration-500 hover:scale-105 z-30"
        >
          {/* Active Image */}
          <img
            src={activeCategory.image}
            alt={activeCategory.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Aperture Shutter Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/60 transition-colors" />

          {/* Viewfinder Target Focus Reticle Corners */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#FF9A3C]/80 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#FF9A3C]/80 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#FF9A3C]/80 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#FF9A3C]/80 pointer-events-none" />

          {/* Center Lens CTA Details */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
            <h4 className="font-oswald text-base sm:text-lg lg:text-xl font-bold text-white uppercase leading-tight my-0.5 drop-shadow-md">
              {activeCategory.title}
            </h4>
            <div className="mt-1 px-3 py-1 rounded-full border border-[#FF9A3C]/60 bg-[#FF9A3C]/20 text-[#FF9A3C] text-[9px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 shadow-md group-hover:bg-[#FF9A3C] group-hover:text-black transition-all">
              <span>EXPLORE</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

      </div>

      {/* Motion Guidance Subtext */}
      <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-white/50 tracking-wider uppercase">
        <Sparkles className="w-3.5 h-3.5 text-[#D946EF] animate-pulse" />
        <span>SPIN WHEEL OR TILT PHONE TO ROTATE</span>
      </div>

    </div>
  );
}

// Dynamically scan public/images/ on disk so added/deleted local files automatically update the gallery
const imageModules = import.meta.glob('/public/images/**/*.{webp,jpg,jpeg,png,PNG,JPG,JPEG}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const categoryFolderMap = {
  potraits: 'PORTRAITS',
  portraits: 'PORTRAITS',
  celebrities: 'PORTRAITS',
  nature: 'NATURE',
  events: 'EVENTS',
  architecture: 'ARCHITECTURE',
  moments: 'MOMENTS',
};

// Deterministic pseudo-random interleave shuffle helper for a varied gallery grid layout
const shuffleInterleave = (arr) => {
  const items = [...arr];
  let seed = 1337;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Seeded Fisher-Yates Shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  // Ensure no 2 adjacent photos share the same subject group or filename prefix
  const getSubjectKey = (src) => {
    const filename = src.split('/').pop().toLowerCase().replace(/\.\w+$/, '');
    if (filename.startsWith('15') || filename.startsWith('16') || filename.startsWith('17') || filename.startsWith('18')) return 'singer-floral';
    if (filename.startsWith('1') || filename.startsWith('6')) return 'dancer-red';
    if (filename.startsWith('2') || filename.startsWith('19')) return 'dancer-white';
    if (filename.startsWith('4.5') || filename.startsWith('10') || filename.startsWith('14')) return 'dancer-black';
    if (filename.startsWith('7') || filename.startsWith('8')) return 'dancer-hat';
    if (filename.startsWith('dv_049') || filename.startsWith('dv_061')) return 'concert-blue';
    return filename;
  };

  for (let i = 1; i < items.length - 1; i++) {
    const prevKey = getSubjectKey(items[i - 1].src);
    const currKey = getSubjectKey(items[i].src);

    if (prevKey === currKey) {
      for (let k = i + 1; k < items.length; k++) {
        if (getSubjectKey(items[k].src) !== prevKey) {
          [items[i], items[k]] = [items[k], items[i]];
          break;
        }
      }
    }
  }

  return items;
};

const rawGalleryItems = Object.keys(imageModules).map((filePath, index) => {
  const cleanSrc = filePath.replace('/public', '');
  const parts = cleanSrc.split('/');
  const folderName = (parts[2] || '').toLowerCase();
  const category = categoryFolderMap[folderName] || folderName.toUpperCase();
  const filename = parts[parts.length - 1];

  return {
    id: `img-${index}-${filename}`,
    title: `${category} Feature ${String(index + 1).padStart(2, '0')}`,
    category,
    src: cleanSrc,
  };
});

const initialGallery = shuffleInterleave(rawGalleryItems);

// Ensure the red/gold tassel dancer photo (Celebrities/4.webp) is positioned as the 1st photo
const targetIdx = initialGallery.findIndex((i) => i.src.includes('Celebrities/4.webp') || i.src.endsWith('/4.webp'));
if (targetIdx > 0) {
  const [targetItem] = initialGallery.splice(targetIdx, 1);
  initialGallery.unshift(targetItem);
}

const galleryItems = initialGallery;

const getCoverImage = (catTitle, defaultFallback) => {
  const item = galleryItems.find((img) => img.category === catTitle);
  return item ? item.src : defaultFallback;
};

export default function Work() {
  const [activeCategoryModal, setActiveCategoryModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalFilter, setModalFilter] = useState('ALL');
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const subtextRef = useRef(null);

  const workCards = [
    {
      id: 'portraits',
      num: '01',
      title: 'PORTRAITS',
      image: getCoverImage('PORTRAITS', '/images/Celebrities/4.webp'),
      offsetY: 'lg:mt-0',
    },
    {
      id: 'nature',
      num: '02',
      title: 'NATURE',
      image: getCoverImage('NATURE', '/images/Nature/1.webp'),
      offsetY: 'lg:mt-8',
    },
    {
      id: 'events',
      num: '03',
      title: 'EVENTS',
      image: getCoverImage('EVENTS', '/images/Events/1.webp'),
      offsetY: 'lg:mt-0',
    },
    {
      id: 'architecture',
      num: '04',
      title: 'ARCHITECTURE',
      image: getCoverImage('ARCHITECTURE', '/images/Architecture/IMG_20260831_005035.webp'),
      offsetY: 'lg:mt-8',
    },
    {
      id: 'moments',
      num: '05',
      title: 'MOMENTS',
      image: getCoverImage('MOMENTS', '/images/Moments/IMG_20260929_200304.png'),
      offsetY: 'lg:mt-0',
    },
  ];

  const filteredGallery = modalFilter === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => item.category === modalFilter);

  const openGalleryModal = (catId = 'ALL') => {
    setModalFilter(catId.toUpperCase());
    setActiveCategoryModal(true);
  };

  const closeAll = () => {
    setActiveCategoryModal(false);
    setSelectedPhoto(null);
  };

  const activeCategory = workCards[activeIndex] || workCards[0];
  const photoCount = galleryItems.filter((i) => i.category === activeCategory.title).length;

  const handleNextWheel = () => {
    setActiveIndex((prev) => (prev + 1) % workCards.length);
  };

  const handlePrevWheel = () => {
    setActiveIndex((prev) => (prev - 1 + workCards.length) % workCards.length);
  };

  // Register global window helper so navbar links can cleanly close all open modals
  useEffect(() => {
    window.closeAllModals = closeAll;
    return () => {
      delete window.closeAllModals;
    };
  }, []);

  // Lock body scroll and pause Lenis smooth scroll when modal is active
  useEffect(() => {
    if (activeCategoryModal || selectedPhoto) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = 'unset';
      if (window.lenis) {
        window.lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [activeCategoryModal, selectedPhoto]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedPhoto) {
          setSelectedPhoto(null);
        } else if (activeCategoryModal) {
          setActiveCategoryModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategoryModal, selectedPhoto]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header Reveal
      gsap.fromTo(
        [tagRef.current, titleRef.current, subtextRef.current],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className="relative py-20 lg:py-28 overflow-hidden"
      >
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-orange-950/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Title & Active Category Info (Desktop Left / Mobile Top) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              
              {/* Section Header Tag */}
              <div ref={tagRef} className="flex items-center gap-4 mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-mono text-[#A855F7] font-semibold tracking-wider">
                  02
                </span>
                <span className="w-8 h-[1px] bg-[#A855F7]/40" />
                <span className="text-xs font-semibold tracking-[0.3em] text-[#A855F7] uppercase">
                  MY WORK
                </span>
              </div>

              {/* Main Heading */}
              <div ref={titleRef} className="mb-5 sm:mb-6">
                <h2 className="font-oswald text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] uppercase text-white">
                  EXPLORE <br />
                  <span className="text-gradient-orange inline-block">
                    MY WORK
                  </span>
                </h2>
              </div>

              {/* Active Category Information Card (Compact on Mobile, Full Spacing on Desktop) */}
              <div ref={subtextRef} className="bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-xs font-mono text-[#D946EF] font-bold tracking-wider uppercase mb-1.5 lg:mb-3">
                  <span>COLLECTION {activeCategory.num} / 05</span>
                </div>

                <h3 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-bold text-white uppercase mb-1.5 lg:mb-3">
                  {activeCategory.title}
                </h3>

                <p className="text-xs lg:text-sm text-[#85848D] leading-relaxed font-light mb-3.5 lg:mb-6">
                  Explore selected captures from {activeCategory.title.toLowerCase()} moments. Click the wheel center or button below to view the complete collection.
                </p>

                {/* Primary CTA Button & Wheel Spin Controls */}
                <div className="flex items-center gap-3 lg:gap-4">
                  <button
                    onClick={() => openGalleryModal(activeCategory.title)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3.5 rounded-full bg-gradient-to-r from-[#D946EF] to-[#A855F7] text-white font-semibold text-xs lg:text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(217,70,239,0.35)] hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                    <span>EXPLORE {activeCategory.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      onClick={handlePrevWheel}
                      aria-label="Previous Category"
                      className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:border-[#FF9A3C] hover:bg-[#FF9A3C]/20 hover:text-[#FF9A3C] transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <button
                      onClick={handleNextWheel}
                      aria-label="Next Category"
                      className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:border-[#FF9A3C] hover:bg-[#FF9A3C]/20 hover:text-[#FF9A3C] transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Larger Top-Aligned Aperture Wheel (Desktop Right / Mobile Bottom) */}
            <div className="lg:col-span-7 flex items-center justify-center lg:pt-[44px]">
              <ApertureWheel
                categories={workCards}
                activeIndex={activeIndex}
                onSelectCategory={(idx) => setActiveIndex(idx)}
                openGalleryModal={openGalleryModal}
              />
            </div>

          </div>

          {/* VIEW ALL WORK Footer Link */}
          <div className="flex justify-center relative z-10 shrink-0 mt-10 sm:mt-14">
            <button
              onClick={() => openGalleryModal('ALL')}
              className="inline-flex items-center gap-4 group cursor-pointer"
            >
              <span className="text-xs font-semibold tracking-[0.25em] text-white/90 group-hover:text-[#FF9A3C] transition-colors uppercase">
                VIEW ALL WORK
              </span>
              <div className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white/80 group-hover:border-[#FF9A3C] group-hover:bg-[#FF9A3C]/20 group-hover:text-white group-hover:scale-110 transition-all">
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

        </div>
      </section>

      {/* LIGHTBOX GALLERY MODAL (High-Performance GPU Optimized Native Scrolling Overlay) */}
      {activeCategoryModal && createPortal(
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[99999] flex flex-col bg-[#03050B] animate-fadeIn overflow-hidden"
        >
          {/* TOP MODAL HEADER BAR */}
          <div className="w-full bg-[#03050B]/98 border-b border-white/10 px-4 sm:px-12 py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20 shrink-0 shadow-2xl">
            
            {/* Top Action Controls Row: BACK TO WORK & CLOSE (Mobile) / Left Group (Desktop) */}
            <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
              <button
                onClick={() => setActiveCategoryModal(false)}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-[#D946EF]/40 bg-[#D946EF]/15 text-[11px] sm:text-xs font-bold text-white hover:bg-[#D946EF] hover:shadow-[0_0_20px_#D946EF] transition-all cursor-pointer group shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:-translate-x-0.5 transition-transform" />
                <span>BACK TO WORK</span>
              </button>

              {/* Title & Collection Name for Desktop */}
              <div className="hidden sm:block">
                <span className="text-[10px] font-mono text-[#D946EF] tracking-widest uppercase block">
                  PORTFOLIO GALLERY
                </span>
                <h3 className="font-oswald text-xl sm:text-2xl font-bold text-white uppercase leading-none">
                  {modalFilter} COLLECTION
                </h3>
              </div>

              {/* Mobile Top Close Button */}
              <button
                onClick={() => setActiveCategoryModal(false)}
                aria-label="Close gallery modal"
                className="sm:hidden w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:border-[#D946EF] hover:bg-[#D946EF] hover:shadow-[0_0_20px_#D946EF] transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Pills Row (Smooth Horizontal Scroll with NO Visible Scrollbars) */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 w-full sm:w-auto no-scrollbar scrollbar-none shrink-0">
              {['ALL', 'PORTRAITS', 'NATURE', 'EVENTS', 'ARCHITECTURE', 'MOMENTS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setModalFilter(cat)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    modalFilter === cat
                      ? 'bg-[#D946EF] text-white shadow-[0_0_18px_rgba(217,70,239,0.6)]'
                      : 'text-[#85848D] hover:text-white bg-white/5 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* High-Contrast Close Button for Desktop */}
            <button
              onClick={() => setActiveCategoryModal(false)}
              aria-label="Close gallery modal"
              className="hidden sm:flex w-10 h-10 rounded-full border border-white/20 bg-white/10 items-center justify-center text-white hover:border-[#D946EF] hover:bg-[#D946EF] hover:shadow-[0_0_20px_#D946EF] transition-all cursor-pointer ml-3 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN MODAL SCROLLABLE PHOTO GRID */}
          <div
            data-lenis-prevent="true"
            className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-12 py-6 sm:py-8 overflow-y-auto custom-scrollbar touch-pan-y transform-gpu overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch', willChange: 'scroll-position' }}
          >
            {/* Mobile Category Title Banner */}
            <div className="sm:hidden mb-5">
              <span className="text-[10px] font-mono text-[#D946EF] tracking-widest uppercase block mb-0.5">
                PORTFOLIO GALLERY
              </span>
              <h3 className="font-oswald text-2xl font-bold text-white uppercase tracking-wide">
                {modalFilter} COLLECTION
              </h3>
            </div>

            {/* Dynamic Grid Layout: 2 Columns Landscape for EVENTS tab alone, 3 Columns Portrait for others */}
            <div className={
              modalFilter === 'EVENTS'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 pb-16 perspective-[1000px]'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 pb-16 perspective-[1000px]'
            }>
              {filteredGallery.map((item) => (
                <ModalGalleryCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedPhoto(item)}
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SINGLE PHOTO FULLSCREEN LIGHTBOX (Rendered via React Portal at document.body level z-[100000]) */}
      {selectedPhoto && createPortal(
        <div
          data-lenis-prevent="true"
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[100000] bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fadeIn cursor-pointer"
        >
          <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white hover:border-[#D946EF] hover:bg-[#D946EF] hover:shadow-[0_0_20px_#D946EF] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>BACK TO GALLERY</span>
            </button>
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close fullscreen photo"
              className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:border-[#D946EF] hover:bg-[#D946EF] hover:shadow-[0_0_20px_#D946EF] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-[90vw] flex flex-col items-center animate-scaleUp"
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              loading="eager"
              decoding="async"
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
            />
            <div className="mt-5 text-center">
              <span className="text-xs font-mono text-[#D946EF] uppercase tracking-widest block mb-1">
                {selectedPhoto.category}
              </span>
              <h4 className="font-oswald text-2xl sm:text-3xl text-white uppercase tracking-wide font-bold">
                {selectedPhoto.title}
              </h4>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
