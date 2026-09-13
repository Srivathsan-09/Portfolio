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

      {/* Gradient Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-70 transition-opacity pointer-events-none" />

      {/* Glowing Neon Border Ring */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-[#D946EF] group-hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all pointer-events-none" />

      {/* 3D Depth Content Overlay */}
      <div
        ref={contentRef}
        className="absolute bottom-5 left-5 right-5 z-30 pointer-events-none transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span className="text-[10px] font-mono text-[#D946EF] font-bold uppercase tracking-wider block mb-1 drop-shadow-[0_0_8px_#D946EF]">
          {item.category}
        </span>
        <h4 className="font-oswald font-bold text-white text-xl flex items-center justify-between uppercase tracking-wide">
          <span>{item.title}</span>
          <div className="w-8 h-8 rounded-full bg-[#D946EF]/20 border border-[#D946EF] flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#D946EF] group-hover:shadow-[0_0_15px_#D946EF] transition-all shrink-0 ml-2">
            <ZoomIn className="w-4 h-4" />
          </div>
        </h4>
      </div>
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

            {/* 5 Sector Arc Paths for SVG Curved Text */}
            {[0, 72, 144, 216, 288].map((startAngle, idx) => (
              <path
                key={`text-path-${idx}`}
                id={`sectorTextArc-${idx}`}
                d={describeTextArc(200, 200, 143, startAngle + 5, startAngle + 67)}
              />
            ))}
          </defs>

          {/* 5 Sector Background Arcs (Clickable) */}
          {[0, 72, 144, 216, 288].map((startAngle, idx) => {
            const isSelected = activeIndex === idx;
            const pathData = describeArc(200, 200, 96, 190, startAngle, startAngle + 72);
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
                  setRotationAngle(-idx * 72);
                }}
              />
            );
          })}

          {/* Curved Category Labels along Sector Arcs (NO OVERFLOW EVER!) */}
          {categories.map((cat, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <text
                key={cat.id}
                className="cursor-pointer pointer-events-auto select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(idx);
                  setRotationAngle(-idx * 72);
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

          {/* 5 Spoke Partition Lines */}
          {[0, 72, 144, 216, 288].map((angle, idx) => {
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

        {/* Center Camera Viewfinder Iris (Clean Title & CTA, No Collection Text) */}
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

          {/* Center Lens CTA Details (Title & Explore Pill Only) */}
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
      image: '/images/Potraits/1.webp',
      offsetY: 'lg:mt-0',
    },
    {
      id: 'nature',
      num: '02',
      title: 'NATURE',
      image: '/images/Nature/1.webp',
      offsetY: 'lg:mt-8',
    },
    {
      id: 'events',
      num: '03',
      title: 'EVENTS',
      image: '/images/Events/1.webp',
      offsetY: 'lg:mt-0',
    },
    {
      id: 'celebrities',
      num: '04',
      title: 'CELEBRITIES',
      image: '/images/Celebrities/1.webp',
      offsetY: 'lg:mt-8',
    },
    {
      id: 'architecture',
      num: '05',
      title: 'ARCHITECTURE',
      image: '/images/Architecture/IMG_20260831_005035.webp',
      offsetY: 'lg:mt-0',
    },
  ];

  // Complete List of All Photos Across All Categories
  const galleryItems = [
    // CELEBRITIES INTERLEAVED FOR ZERO ROW REPETITION (19 PHOTOS)
    { id: 'celeb-1', title: 'Celebrity Feature 01', category: 'CELEBRITIES', src: '/images/Celebrities/1.webp' },
    { id: 'celeb-2', title: 'Celebrity Feature 02', category: 'CELEBRITIES', src: '/images/Celebrities/2.webp' },
    { id: 'celeb-3', title: 'Celebrity Feature 03', category: 'CELEBRITIES', src: '/images/Celebrities/3.webp' },
    { id: 'celeb-4', title: 'Celebrity Feature 04', category: 'CELEBRITIES', src: '/images/Celebrities/4.5.webp' },
    { id: 'celeb-5', title: 'Celebrity Feature 05', category: 'CELEBRITIES', src: '/images/Celebrities/15.webp' },
    { id: 'celeb-6', title: 'Celebrity Feature 06', category: 'CELEBRITIES', src: '/images/Celebrities/4.webp' },
    { id: 'celeb-7', title: 'Celebrity Feature 07', category: 'CELEBRITIES', src: '/images/Celebrities/5.webp' },
    { id: 'celeb-8', title: 'Celebrity Feature 08', category: 'CELEBRITIES', src: '/images/Celebrities/7.webp' },
    { id: 'celeb-9', title: 'Celebrity Feature 09', category: 'CELEBRITIES', src: '/images/Celebrities/7.5.webp' },
    { id: 'celeb-10', title: 'Celebrity Feature 10', category: 'CELEBRITIES', src: '/images/Celebrities/16.webp' },
    { id: 'celeb-11', title: 'Celebrity Feature 11', category: 'CELEBRITIES', src: '/images/Celebrities/6.webp' },
    { id: 'celeb-12', title: 'Celebrity Feature 12', category: 'CELEBRITIES', src: '/images/Celebrities/9.webp' },
    { id: 'celeb-13', title: 'Celebrity Feature 13', category: 'CELEBRITIES', src: '/images/Celebrities/8.webp' },
    { id: 'celeb-14', title: 'Celebrity Feature 14', category: 'CELEBRITIES', src: '/images/Celebrities/10.webp' },
    { id: 'celeb-15', title: 'Celebrity Feature 15', category: 'CELEBRITIES', src: '/images/Celebrities/17.webp' },
    { id: 'celeb-16', title: 'Celebrity Feature 16', category: 'CELEBRITIES', src: '/images/Celebrities/11.webp' },
    { id: 'celeb-17', title: 'Celebrity Feature 17', category: 'CELEBRITIES', src: '/images/Celebrities/12.webp' },
    { id: 'celeb-18', title: 'Celebrity Feature 18', category: 'CELEBRITIES', src: '/images/Celebrities/18.webp' },
    { id: 'celeb-19', title: 'Celebrity Feature 19', category: 'CELEBRITIES', src: '/images/Celebrities/19.webp' },

    // PORTRAITS IN EXACT FILE ORDER (12 PHOTOS)
    { id: 'portrait-1', title: 'Portrait Feature 01', category: 'PORTRAITS', src: '/images/Potraits/1.webp' },
    { id: 'portrait-2', title: 'Portrait Feature 02', category: 'PORTRAITS', src: '/images/Potraits/1000189348.webp' },
    { id: 'portrait-3', title: 'Portrait Feature 03', category: 'PORTRAITS', src: '/images/Potraits/DV_04889.webp' },
    { id: 'portrait-4', title: 'Portrait Feature 04', category: 'PORTRAITS', src: '/images/Potraits/DV_04915.webp' },
    { id: 'portrait-5', title: 'Portrait Feature 05', category: 'PORTRAITS', src: '/images/Potraits/DV_04941.webp' },
    { id: 'portrait-6', title: 'Portrait Feature 06', category: 'PORTRAITS', src: '/images/Potraits/DV_06176.webp' },
    { id: 'portrait-7', title: 'Portrait Feature 07', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260329_002734.webp' },
    { id: 'portrait-8', title: 'Portrait Feature 08', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260417_154531.webp' },
    { id: 'portrait-9', title: 'Portrait Feature 09', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260417_155522.webp' },
    { id: 'portrait-10', title: 'Portrait Feature 10', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260530_150809.webp' },
    { id: 'portrait-11', title: 'Portrait Feature 11', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260530_151137.webp' },
    { id: 'portrait-12', title: 'Portrait Feature 12', category: 'PORTRAITS', src: '/images/Potraits/ChatGPT Image Aug 14, 2026, 11_34_36 PM (2).webp' },

    // EVENTS IN EXACT FILE ORDER (13 PHOTOS - LANDSCAPE FORMAT)
    { id: 'event-1', title: 'Event Feature 01', category: 'EVENTS', src: '/images/Events/1.webp' },
    { id: 'event-2', title: 'Event Feature 02', category: 'EVENTS', src: '/images/Events/2.webp' },
    { id: 'event-3', title: 'Event Feature 03', category: 'EVENTS', src: '/images/Events/3.webp' },
    { id: 'event-4', title: 'Event Feature 04', category: 'EVENTS', src: '/images/Events/DV_06538.webp' },
    { id: 'event-5', title: 'Event Feature 05', category: 'EVENTS', src: '/images/Events/IMG_0329.webp' },
    { id: 'event-6', title: 'Event Feature 06', category: 'EVENTS', src: '/images/Events/IMG_0442.webp' },
    { id: 'event-7', title: 'Event Feature 07', category: 'EVENTS', src: '/images/Events/IMG_0546.webp' },
    { id: 'event-8', title: 'Event Feature 08', category: 'EVENTS', src: '/images/Events/IMG_20260812_224848.webp' },
    { id: 'event-9', title: 'Event Feature 09', category: 'EVENTS', src: '/images/Events/IMG_20260812_224948.webp' },
    { id: 'event-10', title: 'Event Feature 10', category: 'EVENTS', src: '/images/Events/ChatGPT Image Aug 12, 2026, 10_39_21 PM.webp' },
    { id: 'event-11', title: 'Event Feature 11', category: 'EVENTS', src: '/images/Events/ChatGPT Image Aug 12, 2026, 11_05_02 PM.webp' },
    { id: 'event-12', title: 'Event Feature 12', category: 'EVENTS', src: '/images/Events/IMG_4828.webp' },
    { id: 'event-13', title: 'Event Feature 13', category: 'EVENTS', src: '/images/Events/IMG_4845.webp' },

    // NATURE IN EXACT FILE ORDER (8 PHOTOS)
    { id: 'nature-1', title: 'Nature Feature 01', category: 'NATURE', src: '/images/Nature/1.webp' },
    { id: 'nature-2', title: 'Nature Feature 02', category: 'NATURE', src: '/images/Nature/2.webp' },
    { id: 'nature-3', title: 'Nature Feature 03', category: 'NATURE', src: '/images/Nature/1000006787-01.webp' },
    { id: 'nature-4', title: 'Nature Feature 04', category: 'NATURE', src: '/images/Nature/IMG_20240430_174208 (1).webp' },
    { id: 'nature-5', title: 'Nature Feature 05', category: 'NATURE', src: '/images/Nature/IMG_20240505_113645.webp' },
    { id: 'nature-6', title: 'Nature Feature 06', category: 'NATURE', src: '/images/Nature/IMG_20260812_232109.webp' },
    { id: 'nature-7', title: 'Nature Feature 07', category: 'NATURE', src: '/images/Nature/IMG_20260825_222408 (1).webp' },
    { id: 'nature-8', title: 'Nature Feature 08', category: 'NATURE', src: '/images/Nature/file_00000000d8e082118f7415f4ee04e1f0.webp' },

    // ARCHITECTURE IN EXACT FILE ORDER (2 PHOTOS)
    { id: 'arch-1', title: 'Architecture Feature 01', category: 'ARCHITECTURE', src: '/images/Architecture/IMG_20260831_005035.webp' },
    { id: 'arch-2', title: 'Architecture Feature 02', category: 'ARCHITECTURE', src: '/images/Architecture/IMG_20260831_005259.webp' },
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
              {['ALL', 'PORTRAITS', 'NATURE', 'EVENTS', 'CELEBRITIES', 'ARCHITECTURE'].map((cat) => (
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
