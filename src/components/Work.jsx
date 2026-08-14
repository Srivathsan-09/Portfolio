import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, X, ZoomIn, Sparkles, ChevronLeft } from 'lucide-react';
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
  const [isLoaded, setIsLoaded] = useState(false);

  const handleMouseMove = (e) => {
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
      className={`relative aspect-[3/4] rounded-3xl overflow-hidden card-border-glow cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${offsetY} transform-gpu transition-all duration-300 preserve-3d bg-[#0d0f17]`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse z-0" />
      )}

      <img
        ref={imgRef}
        src={image}
        alt={`Srivathsan ${title} photography`}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover object-center transform-gpu transition-all duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
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

// Optimized 3D Interactive Animated Card for Modal Gallery Grid
function ModalGalleryCard({ item, onClick }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const glareRef = useRef(null);
  const contentRef = useRef(null);
  const rafId = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isLandscape = item.category === 'EVENTS';
  const aspectClass = isLandscape ? 'aspect-[16/10]' : 'aspect-[3/4]';

  const handleMouseMove = (e) => {
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
      className={`relative ${aspectClass} rounded-2xl overflow-hidden border border-white/10 cursor-pointer group card-border-glow bg-[#0d0f17] shadow-2xl transform-gpu transition-all duration-300 preserve-3d animate-fadeIn`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Skeleton pulse loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse z-0" />
      )}

      <img
        ref={imgRef}
        src={item.src}
        alt={item.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transform-gpu transition-all duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
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

export default function Work() {
  const [activeCategoryModal, setActiveCategoryModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalFilter, setModalFilter] = useState('ALL');

  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const subtextRef = useRef(null);
  const cardsRef = useRef([]);

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
  ];

  // Complete List of All Photos Across All Categories
  const galleryItems = [
    // CELEBRITIES IN EXACT NUMERICAL ORDER (16 PHOTOS)
    { id: 1, title: 'Celebrity Feature 01', category: 'CELEBRITIES', src: '/images/Celebrities/1.webp' },
    { id: 2, title: 'Celebrity Feature 02', category: 'CELEBRITIES', src: '/images/Celebrities/2.webp' },
    { id: 3, title: 'Celebrity Feature 03', category: 'CELEBRITIES', src: '/images/Celebrities/3.webp' },
    { id: 4, title: 'Celebrity Feature 04', category: 'CELEBRITIES', src: '/images/Celebrities/4.webp' },
    { id: 5, title: 'Celebrity Feature 05', category: 'CELEBRITIES', src: '/images/Celebrities/4.5.webp' },
    { id: 6, title: 'Celebrity Feature 06', category: 'CELEBRITIES', src: '/images/Celebrities/5.webp' },
    { id: 7, title: 'Celebrity Feature 07', category: 'CELEBRITIES', src: '/images/Celebrities/6.webp' },
    { id: 8, title: 'Celebrity Feature 08', category: 'CELEBRITIES', src: '/images/Celebrities/7.webp' },
    { id: 9, title: 'Celebrity Feature 09', category: 'CELEBRITIES', src: '/images/Celebrities/7.5.webp' },
    { id: 10, title: 'Celebrity Feature 10', category: 'CELEBRITIES', src: '/images/Celebrities/8.webp' },
    { id: 11, title: 'Celebrity Feature 11', category: 'CELEBRITIES', src: '/images/Celebrities/9.webp' },
    { id: 12, title: 'Celebrity Feature 12', category: 'CELEBRITIES', src: '/images/Celebrities/10.webp' },
    { id: 13, title: 'Celebrity Feature 13', category: 'CELEBRITIES', src: '/images/Celebrities/11.webp' },
    { id: 14, title: 'Celebrity Feature 14', category: 'CELEBRITIES', src: '/images/Celebrities/12.webp' },
    { id: 15, title: 'Celebrity Feature 15', category: 'CELEBRITIES', src: '/images/Celebrities/13.webp' },
    { id: 16, title: 'Celebrity Feature 16', category: 'CELEBRITIES', src: '/images/Celebrities/14.webp' },

    // PORTRAITS IN EXACT FILE ORDER (11 PHOTOS)
    { id: 17, title: 'Portrait Feature 01', category: 'PORTRAITS', src: '/images/Potraits/1.webp' },
    { id: 18, title: 'Portrait Feature 02', category: 'PORTRAITS', src: '/images/Potraits/1000189348.webp' },
    { id: 19, title: 'Portrait Feature 03', category: 'PORTRAITS', src: '/images/Potraits/DV_04889.webp' },
    { id: 20, title: 'Portrait Feature 04', category: 'PORTRAITS', src: '/images/Potraits/DV_04915.webp' },
    { id: 21, title: 'Portrait Feature 05', category: 'PORTRAITS', src: '/images/Potraits/DV_04941.webp' },
    { id: 22, title: 'Portrait Feature 06', category: 'PORTRAITS', src: '/images/Potraits/DV_06176.webp' },
    { id: 23, title: 'Portrait Feature 07', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260329_002734.webp' },
    { id: 24, title: 'Portrait Feature 08', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260417_154531.webp' },
    { id: 25, title: 'Portrait Feature 09', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260417_155522.webp' },
    { id: 27, title: 'Portrait Feature 10', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260530_150809.webp' },
    { id: 28, title: 'Portrait Feature 11', category: 'PORTRAITS', src: '/images/Potraits/IMG_20260530_151137.webp' },

    // EVENTS IN EXACT FILE ORDER (11 PHOTOS - LANDSCAPE FORMAT)
    { id: 29, title: 'Event Feature 01', category: 'EVENTS', src: '/images/Events/1.webp' },
    { id: 30, title: 'Event Feature 02', category: 'EVENTS', src: '/images/Events/2.webp' },
    { id: 31, title: 'Event Feature 03', category: 'EVENTS', src: '/images/Events/3.webp' },
    { id: 32, title: 'Event Feature 04', category: 'EVENTS', src: '/images/Events/DV_06538.webp' },
    { id: 33, title: 'Event Feature 05', category: 'EVENTS', src: '/images/Events/IMG_0329.webp' },
    { id: 34, title: 'Event Feature 06', category: 'EVENTS', src: '/images/Events/IMG_0442.webp' },
    { id: 35, title: 'Event Feature 07', category: 'EVENTS', src: '/images/Events/IMG_0546.webp' },
    { id: 36, title: 'Event Feature 08', category: 'EVENTS', src: '/images/Events/IMG_20260812_224848.webp' },
    { id: 37, title: 'Event Feature 09', category: 'EVENTS', src: '/images/Events/IMG_20260812_224948.webp' },
    { id: 38, title: 'Event Feature 10', category: 'EVENTS', src: '/images/Events/ChatGPT Image Aug 12, 2026, 10_39_21 PM.webp' },
    { id: 39, title: 'Event Feature 11', category: 'EVENTS', src: '/images/Events/ChatGPT Image Aug 12, 2026, 11_05_02 PM.webp' },

    // NATURE IN EXACT FILE ORDER (6 PHOTOS)
    { id: 41, title: 'Nature Feature 01', category: 'NATURE', src: '/images/Nature/1.webp' },
    { id: 42, title: 'Nature Feature 02', category: 'NATURE', src: '/images/Nature/2.webp' },
    { id: 43, title: 'Nature Feature 03', category: 'NATURE', src: '/images/Nature/1000006787-01.webp' },
    { id: 44, title: 'Nature Feature 04', category: 'NATURE', src: '/images/Nature/IMG_20240430_174208 (1).webp' },
    { id: 45, title: 'Nature Feature 05', category: 'NATURE', src: '/images/Nature/IMG_20240505_113645.webp' },
    { id: 46, title: 'Nature Feature 06', category: 'NATURE', src: '/images/Nature/IMG_20260812_232109.webp' },
  ];

  // Warm-up Cache by background prefetching images into browser & SW cache
  useEffect(() => {
    const prefetchImages = () => {
      galleryItems.forEach((item) => {
        const img = new Image();
        img.src = item.src;
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchImages, { timeout: 3000 });
    } else {
      setTimeout(prefetchImages, 1500);
    }
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAll();
    };

    if (activeCategoryModal || selectedPhoto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCategoryModal, selectedPhoto]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.5'
        );

      cardsRef.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        gsap.fromTo(
          cardEl,
          { opacity: 0, y: 80, rotateX: -15, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.9,
            delay: idx * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardEl,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#D946EF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#FF9A3C]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div ref={tagRef} className="inline-block mb-4">
          <span className="px-4 py-1.5 rounded-full border border-[#D946EF]/40 bg-[#D946EF]/10 text-xs font-mono text-[#D946EF] font-bold uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(217,70,239,0.2)]">
            Selected Works
          </span>
        </div>

        <h2
          ref={titleRef}
          className="font-oswald text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase mb-6"
        >
          EXPLORE THE <span className="gradient-text font-serif italic font-normal lower-case">Gallery</span>
        </h2>

        <p ref={subtextRef} className="text-white/70 text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
          Hover over each interactive 3D card to feel the motion. Click any category to enter full immersion modal view.
        </p>
      </div>

      {/* Main 4 Work Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
        {workCards.map((card, idx) => (
          <Interactive3DCard
            key={card.id}
            card={card}
            num={card.num}
            title={card.title}
            image={card.image}
            offsetY={card.offsetY}
            innerRef={(el) => (cardsRef.current[idx] = el)}
            onClick={() => openGalleryModal(card.id)}
          />
        ))}
      </div>

      {/* Bottom CTA to Open All */}
      <div className="mt-16 text-center">
        <button
          onClick={() => openGalleryModal('ALL')}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl text-sm font-bold text-white uppercase tracking-widest hover:border-[#D946EF] hover:bg-[#D946EF]/20 hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-[#D946EF] group-hover:rotate-12 transition-transform" />
          <span>VIEW FULL PORTFOLIO COLLECTION ({galleryItems.length} PHOTOS)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* IMMERSIVE CATEGORY MODAL DIALOG */}
      {activeCategoryModal &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-[#03050B]/95 backdrop-blur-2xl flex flex-col animate-fadeIn overflow-hidden">
            {/* Modal Header Bar */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0 z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={closeAll}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:border-[#D946EF] hover:bg-[#D946EF]/30 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <span className="text-[10px] font-mono text-[#D946EF] tracking-widest uppercase block">
                    Portfolio Gallery
                  </span>
                  <h3 className="font-oswald text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
                    {modalFilter} COLLECTION
                  </h3>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="hidden md:flex items-center gap-2 bg-black/60 border border-white/10 rounded-full p-1">
                {['ALL', 'PORTRAITS', 'NATURE', 'EVENTS', 'CELEBRITIES'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setModalFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      modalFilter === cat
                        ? 'bg-gradient-to-r from-[#D946EF] to-[#FF9A3C] text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={closeAll}
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:border-[#D946EF] hover:bg-[#D946EF]/30 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Pills */}
            <div className="flex md:hidden items-center gap-2 overflow-x-auto px-6 py-3 border-b border-white/10 shrink-0 no-scrollbar">
              {['ALL', 'PORTRAITS', 'NATURE', 'EVENTS', 'CELEBRITIES'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setModalFilter(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                    modalFilter === cat
                      ? 'bg-[#D946EF] text-white'
                      : 'bg-white/5 text-white/60 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Modal Gallery Grid Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-12">
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

      {/* FULLSCREEN SINGLE PHOTO LIGHTBOX */}
      {selectedPhoto &&
        createPortal(
          <div
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
    </section>
  );
}
