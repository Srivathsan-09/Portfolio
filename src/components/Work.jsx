import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const CameraScene = React.lazy(() => import('./work3d/CameraScene'));

function CameraSceneSkeleton() {
  return (
    <div className="relative w-full h-[580px] sm:h-[640px] lg:h-[720px] flex items-center justify-center rounded-2xl overflow-hidden select-none">
      <div className="absolute w-72 h-72 rounded-full bg-[#FF9800]/8 blur-[120px] animate-pulse pointer-events-none" />
      <div className="relative flex flex-col items-center gap-3 text-white/40">
        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-[#FF9800]/50 animate-ping opacity-35" />
        </div>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF9800]/80 uppercase">
          INITIALIZING 3D STUDIO...
        </span>
      </div>
    </div>
  );
}

gsap.registerPlugin(ScrollTrigger);

// Optimized 3D Interactive Animated Card for Modal Gallery Grid with Multi-Panel Curtain Reveal
function ModalGalleryCard({ item, index = 0, onClick }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const glareRef = useRef(null);
  const contentRef = useRef(null);
  const lightSweepRef = useRef(null);
  const curtainPanelsRef = useRef([]);
  const rafId = useRef(null);

  const aspectClass = 'aspect-[3/4]';

  // Multi-Panel Curtain Reveal & Warm Light Sweep on Card Mount / Filter Change
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      if (curtainPanelsRef.current) {
        gsap.set(curtainPanelsRef.current.filter(Boolean), { scaleY: 0 });
      }
      return;
    }

    const delay = 0.04 + (index % 8) * 0.035;
    const tl = gsap.timeline({ delay });

    // Restrained scale 1.04 to 1.0
    if (imgRef.current) {
      tl.fromTo(
        imgRef.current,
        { scale: 1.04 },
        { scale: 1.0, duration: 1.15, ease: 'expo.out' },
        0
      );
    }

    // 4-Panel Curtain Reveal with power4.inOut
    const validPanels = curtainPanelsRef.current.filter(Boolean);
    if (validPanels.length > 0) {
      tl.to(
        validPanels,
        {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.85,
          stagger: 0.05,
          ease: 'power4.inOut',
        },
        0.04
      );
    }

    // Warm light sweep during the reveal
    if (lightSweepRef.current) {
      tl.fromTo(
        lightSweepRef.current,
        { x: '-100%', opacity: 0 },
        { x: '220%', opacity: 1, duration: 0.95, ease: 'power2.inOut' },
        0.12
      );
    }
  }, [item.id, index]);

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

      cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;

      if (imgRef.current) {
        const moveX = ((x - centerX) / centerX) * -8;
        const moveY = ((y - centerY) / centerY) * -8;
        imgRef.current.style.transform = `scale(1.06) translate3d(${moveX}px, ${moveY}px, 12px)`;
      }

      if (contentRef.current) {
        const textX = ((x - centerX) / centerX) * 4;
        const textY = ((y - centerY) / centerY) * 4;
        contentRef.current.style.transform = `translate3d(${textX}px, ${textY}px, 20px)`;
      }

      if (glareRef.current) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 176, 46, 0.35), rgba(255, 152, 0, 0.15) 45%, transparent 70%)`;
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
      data-cursor="view"
      className={`gallery-photo-card relative w-full max-w-[340px] sm:max-w-none mx-auto ${aspectClass} rounded-2xl overflow-hidden border border-white/10 cursor-pointer group card-border-glow bg-[#0d0d0d] shadow-2xl transform-gpu transition-all duration-300 preserve-3d will-change-transform`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* High-Resolution Photography Image */}
      <img
        ref={imgRef}
        src={item.src}
        alt={`Srivathsan ${item.category} photograph ${index + 1}`}
        loading={index < 8 ? 'eager' : 'lazy'}
        fetchPriority={index < 4 ? 'high' : 'auto'}
        decoding="async"
        className="w-full h-full object-cover transform-gpu transition-transform duration-500 ease-out will-change-transform"
      />

      {/* Dynamic Specular Glare Layer */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-20 mix-blend-screen"
      />

      {/* Warm Light Sweep Layer (Fires on Reveal) */}
      <div
        ref={lightSweepRef}
        className="absolute inset-0 pointer-events-none z-15 opacity-0 transform-gpu will-change-transform"
        style={{
          background:
            'linear-gradient(105deg, transparent 20%, rgba(255, 152, 0, 0.12) 42%, rgba(255, 176, 46, 0.28) 50%, rgba(255, 152, 0, 0.12) 58%, transparent 80%)',
        }}
      />

      {/* Multi-Panel Curtain Reveal: 4 Vertical Panels */}
      <div className="absolute inset-0 flex pointer-events-none z-25 overflow-hidden">
        {[0, 1, 2, 3].map((p) => (
          <div
            key={p}
            ref={(el) => (curtainPanelsRef.current[p] = el)}
            className="flex-1 h-full bg-[#0d0d0d] -mr-[1px] origin-top will-change-transform"
          />
        ))}
      </div>

      {/* Subtle Cinematic Dark Gradient Overlay (Reveals on Hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

      {/* Thin Orange Top Accent Line (Reveals on Hover) */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF9800] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30" />

      {/* Animated Image Index Badge (Top Left) */}
      <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-md bg-black/75 border border-white/10 backdrop-blur-md opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
        <span className="text-[10px] font-mono text-[#FF9800] font-bold tracking-widest">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Animated VIEW PHOTO Label & Category (Bottom) */}
      <div
        ref={contentRef}
        className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
      >
        <span className="text-[10px] font-mono text-[#FF9800] uppercase tracking-widest font-bold">
          {item.category}
        </span>
        <div className="px-2.5 py-1 rounded-full bg-[#FF9800] text-black font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-[0_0_15px_rgba(255,152,0,0.5)] shrink-0">
          <span>VIEW PHOTO</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Glowing Neon Border Ring & Elegant Orange Hover Glow */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-[#FF9800]/70 group-hover:shadow-[0_0_25px_rgba(255,152,0,0.45)] transition-all pointer-events-none z-20" />
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
    const filename = decodeURIComponent(src.split('/').pop().toLowerCase().replace(/\.\w+$/, ''));
    if (filename.includes('floral') || filename.startsWith('15') || filename.startsWith('16') || filename.startsWith('17') || filename.startsWith('18')) return 'singer-floral';
    if (filename.includes('red and gold') || filename.includes('red-lit') || filename.startsWith('1') || filename.startsWith('6')) return 'dancer-red';
    if (filename.includes('denim') || filename.includes('spotlight singer')) return 'singer-denim';
    if (filename.includes('bollywood') || filename.includes('neon lights')) return 'dancer-bollywood';
    if (filename.includes('red and blue') || filename.includes('spotlight dance')) return 'dancer-red-blue';
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

const rawGalleryItems = Object.keys(imageModules)
  .filter((filePath) => {
    const cleanSrc = filePath.replace('/public', '');
    const parts = cleanSrc.split('/');
    // Must be inside a subfolder under images: /images/<category>/<filename>
    return parts.length > 3 && Boolean(categoryFolderMap[parts[2]?.toLowerCase()]);
  })
  .map((filePath, index) => {
    const cleanSrc = filePath.replace('/public', '');
    const parts = cleanSrc.split('/');
    const folderName = (parts[2] || '').toLowerCase();
    const category = categoryFolderMap[folderName] || folderName.toUpperCase();
    const filename = parts[parts.length - 1];

    const nameWithoutExt = decodeURIComponent(filename).replace(/\.[^/.]+$/, '');
    const isDescriptiveName =
      /^[A-Za-z][A-Za-z0-9 _-]{4,}$/.test(nameWithoutExt) &&
      !nameWithoutExt.toUpperCase().startsWith('IMG_') &&
      !nameWithoutExt.toUpperCase().startsWith('DV_') &&
      !nameWithoutExt.toUpperCase().startsWith('CHATGPT') &&
      !nameWithoutExt.startsWith('_MG_');

    const title = isDescriptiveName
      ? nameWithoutExt
      : `${category} Feature ${String(index + 1).padStart(2, '0')}`;

    return {
      id: `img-${index}-${filename}`,
      title,
      category,
      src: cleanSrc,
    };
  });

const initialGallery = shuffleInterleave(rawGalleryItems);

// Ensure the red/gold tassel dancer photo (Celebrities/4.webp) is positioned as the 1st photo in ALL / PORTRAITS
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

export default function Work({ isMobile = false }) {
  const [activeCategoryModal, setActiveCategoryModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalFilter, setModalFilter] = useState('ALL');
  const [shouldMount3D, setShouldMount3D] = useState(false);

  const sectionRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const subtextRef = useRef(null);
  const gridRef = useRef(null);
  const modalScrollRef = useRef(null);
  const lightboxImgRef = useRef(null);
  const prevFilterRef = useRef(modalFilter);
  const prevModalStateRef = useRef(activeCategoryModal);

  // Progressive 3D Loading: Mount heavy Three.js scene only when approaching viewport
  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount3D(true);
          observer.disconnect();
        }
      },
      { rootMargin: '450px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const workCards = [
    {
      id: 'portraits',
      num: '01',
      title: 'PORTRAITS',
      image: '/images/Celebrities/1.webp',
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
      id: 'architecture',
      num: '03',
      title: 'ARCHITECTURE',
      image: getCoverImage('ARCHITECTURE', '/images/Architecture/IMG_20260831_005035.webp'),
      offsetY: 'lg:mt-0',
    },
    {
      id: 'moments',
      num: '04',
      title: 'MOMENTS',
      image: getCoverImage('MOMENTS', '/images/Moments/IMG_20260929_200304.png'),
      offsetY: 'lg:mt-8',
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




  // Lightbox Previous & Next Navigation
  const handlePrevPhoto = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!filteredGallery.length) return;
    const currentIndex = filteredGallery.findIndex((p) => p.id === selectedPhoto?.id);
    const prevIdx = (currentIndex - 1 + filteredGallery.length) % filteredGallery.length;
    setSelectedPhoto(filteredGallery[prevIdx]);
  }, [filteredGallery, selectedPhoto?.id]);

  const handleNextPhoto = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!filteredGallery.length) return;
    const currentIndex = filteredGallery.findIndex((p) => p.id === selectedPhoto?.id);
    const nextIdx = (currentIndex + 1) % filteredGallery.length;
    setSelectedPhoto(filteredGallery[nextIdx]);
  }, [filteredGallery, selectedPhoto?.id]);

  // Register global window helper so navbar links can cleanly close all open modals
  useEffect(() => {
    window.closeAllModals = closeAll;
    return () => {
      delete window.closeAllModals;
    };
  }, []);

  // Lock body scroll and pause Lenis smooth scroll when modal or lightbox is active
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

  // Full Keyboard Navigation: ArrowRight (Next), ArrowLeft (Prev), Escape (Close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPhoto) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextPhoto();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevPhoto();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setSelectedPhoto(null);
        }
      } else if (activeCategoryModal) {
        if (e.key === 'Escape') {
          setActiveCategoryModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategoryModal, selectedPhoto, handleNextPhoto, handlePrevPhoto]);

  // Subtle Lightbox image transition when navigating between photographs
  useEffect(() => {
    if (!selectedPhoto || !lightboxImgRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.fromTo(
      lightboxImgRef.current,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: 'power2.out',
      }
    );
  }, [selectedPhoto]);

  // 1. STAGGERED IMAGE REVEAL & 5. FILM-STRIP CATEGORY FILTER TRANSITIONS
  useEffect(() => {
    if (!activeCategoryModal || !gridRef.current) {
      prevModalStateRef.current = activeCategoryModal;
      return;
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = gridRef.current.children;
    if (!cards || cards.length === 0) return;

    if (prefersReduced) {
      gsap.set(cards, { opacity: 1, x: 0, y: 0, scale: 1, rotationZ: 0, rotateY: 0, filter: 'blur(0px)' });
      prevFilterRef.current = modalFilter;
      prevModalStateRef.current = activeCategoryModal;
      return;
    }

    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }

    const isFilterChange = prevFilterRef.current !== modalFilter && prevModalStateRef.current === activeCategoryModal;
    prevFilterRef.current = modalFilter;
    prevModalStateRef.current = activeCategoryModal;

    if (isFilterChange) {
      // B. Film-strip transition: Sequential slide with controlled depth and 3D perspective
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          x: 45,
          rotateY: -5,
          scale: 0.94,
          filter: 'blur(6px)',
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.52,
          ease: 'power3.out',
          stagger: {
            each: 0.032,
            from: 'start',
          },
          overwrite: 'auto',
        }
      );
    } else {
      // A. Cascading staggered entrance with opacity, upward movement, scale and subtle rotation
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 35,
          scale: 0.92,
          rotationZ: (i) => (i % 2 === 0 ? -1.5 : 1.5),
          filter: 'blur(8px)',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationZ: 0,
          filter: 'blur(0px)',
          duration: 0.58,
          ease: 'power3.out',
          stagger: {
            each: 0.038,
            from: 'start',
            grid: 'auto',
          },
          overwrite: 'auto',
        }
      );
    }
  }, [activeCategoryModal, modalFilter]);

  // 6. SCROLL ANIMATIONS: Reveal gallery rows as they enter the viewport
  useEffect(() => {
    if (!activeCategoryModal || !modalScrollRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cards = modalScrollRef.current.querySelectorAll('.gallery-photo-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 24, filter: 'blur(4px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.45,
                ease: 'power2.out',
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: modalScrollRef.current,
        threshold: 0.08,
      }
    );

    cards.forEach((card, idx) => {
      if (idx >= 8) {
        gsap.set(card, { opacity: 0, y: 24, filter: 'blur(4px)' });
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [activeCategoryModal, modalFilter]);

  useEffect(() => {
    // Keep header content immediately visible without redundant scroll-lock entrance delays
    if (tagRef.current) tagRef.current.style.opacity = '1';
    if (titleRef.current) titleRef.current.style.opacity = '1';
    if (subtextRef.current) subtextRef.current.style.opacity = '1';
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className={`relative py-20 lg:py-28 overflow-hidden bg-[#080808] z-10 ${
          isMobile ? 'mt-0' : 'md:-mt-[100vh]'
        }`}
      >
        {/* Smooth top blend from #080808 for completely seamless transition from About section */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080808] via-[#080808]/90 to-transparent pointer-events-none z-0" />
        {/* Smooth bottom blend from #080808 for completely seamless transition into StoryStrip */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent pointer-events-none z-0" />
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#FF9800]/8 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1560px] mx-auto px-6 sm:pl-20 sm:pr-8 md:pl-24 md:pr-10 lg:pl-28 lg:pr-12 xl:pl-32 xl:pr-16 relative z-10 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Title & Visual Identity (Desktop Left / Mobile Top) */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              
              {/* Section Header Tag */}
              <div ref={tagRef} className="flex items-center gap-3 mb-4 sm:mb-5">
                <span className="text-xs sm:text-sm font-mono text-[#FF9800] font-semibold tracking-wider">
                  02
                </span>
                <span className="w-8 h-[1px] bg-[#FF9800]/40" />
                <span className="text-xs font-semibold tracking-[0.3em] text-[#FF9800] uppercase">
                  MY WORK
                </span>
              </div>

              {/* Main Heading */}
              <div ref={titleRef} className="mb-5 sm:mb-6">
                <h2 className="font-oswald text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] uppercase text-white tracking-tight">
                  EXPLORE <br />
                  <span className="bg-gradient-to-r from-[#FF9800] via-[#FFB02E] to-[#FFA726] bg-clip-text text-transparent inline-block">
                    MY WORLD
                  </span>
                </h2>
              </div>

              {/* Supporting Text */}
              <p ref={subtextRef} className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light mb-8 max-w-md">
                Every photograph tells a story. Explore the moments, places and perspectives I've captured through my lens.
              </p>

              {/* Minimal CTA */}
              <div className="mb-8">
                <button
                  onClick={() => openGalleryModal('ALL')}
                  className="inline-flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#FF9800] via-[#FFB02E] to-[#FFA726] text-black font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(255,152,0,0.4)] hover:shadow-[0_0_30px_rgba(255,152,0,0.65)] hover:scale-[1.02] transition-all cursor-pointer group"
                >
                  <span>EXPLORE COLLECTIONS</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Quick Collection Category Badges */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10 max-w-md">
                {workCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => openGalleryModal(card.title)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-[#FF9800]/60 hover:bg-[#FF9800]/10 text-white/80 hover:text-[#FF9800] text-xs font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="text-[#FF9800] font-bold">{card.num}</span>
                    <span className="font-medium">{card.title}</span>
                  </button>
                ))}
              </div>

            </div>

            {/* RIGHT COLUMN: 3D Camera & Emerging Photographs Canvas */}
            <div
              ref={canvasContainerRef}
              className="lg:col-span-8 flex items-center justify-center relative min-h-[740px] sm:min-h-[760px] lg:min-h-[720px] w-full"
            >
              {shouldMount3D ? (
                <React.Suspense fallback={<CameraSceneSkeleton />}>
                  <CameraScene
                    collections={workCards}
                    openGalleryModal={openGalleryModal}
                    isMobile={isMobile}
                  />
                </React.Suspense>
              ) : (
                <CameraSceneSkeleton />
              )}
            </div>

          </div>

        </div>
      </section>

      {/* LIGHTBOX GALLERY MODAL (High-Performance GPU Optimized Native Scrolling Overlay) */}
      {activeCategoryModal && createPortal(
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[99999] flex flex-col bg-[#080808] animate-fadeIn overflow-hidden"
        >
          {/* TOP MODAL HEADER BAR */}
          <div className="w-full bg-[#080808]/98 border-b border-white/10 px-4 sm:px-12 py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20 shrink-0 shadow-2xl">
            
            {/* Top Action Controls Row: BACK TO WORK & CLOSE (Mobile) / Left Group (Desktop) */}
            <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
              <button
                onClick={() => setActiveCategoryModal(false)}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-[#FF9800]/50 bg-[#FF9800]/15 text-[11px] sm:text-xs font-bold text-white hover:bg-[#FF9800] hover:text-black hover:border-[#FF9800] hover:shadow-[0_0_20px_rgba(255,152,0,0.5)] transition-all cursor-pointer group shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:-translate-x-0.5 transition-transform" />
                <span>BACK TO WORK</span>
              </button>

              {/* Title & Collection Name for Desktop */}
              <div className="hidden sm:block">
                <span className="text-[10px] font-mono text-[#FF9800] tracking-widest uppercase block">
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
                className="sm:hidden w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:border-[#FF9800] hover:bg-[#FF9800] hover:text-black hover:shadow-[0_0_20px_rgba(255,152,0,0.5)] transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Pills Row (Smooth Horizontal Scroll with NO Visible Scrollbars) */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 w-full sm:w-auto no-scrollbar scrollbar-none shrink-0">
              {['ALL', 'PORTRAITS', 'NATURE', 'ARCHITECTURE', 'MOMENTS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setModalFilter(cat)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    modalFilter === cat
                      ? 'bg-[#FF9800] text-black font-bold shadow-[0_0_18px_rgba(255,152,0,0.6)]'
                      : 'text-[#A0A0A0] hover:text-white bg-white/5 border border-white/10 hover:border-white/20'
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
              className="hidden sm:flex w-10 h-10 rounded-full border border-white/20 bg-white/10 items-center justify-center text-white hover:border-[#FF9800] hover:bg-[#FF9800] hover:text-black hover:shadow-[0_0_20px_rgba(255,152,0,0.5)] transition-all cursor-pointer ml-3 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN MODAL SCROLLABLE PHOTO GRID */}
          <div
            ref={modalScrollRef}
            data-lenis-prevent="true"
            className="flex-1 w-full max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto custom-scrollbar touch-pan-y transform-gpu overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch', willChange: 'scroll-position' }}
          >
            {/* Mobile Category Title Banner */}
            <div className="sm:hidden mb-5">
              <span className="text-[10px] font-mono text-[#FF9800] tracking-widest uppercase block mb-0.5">
                PORTFOLIO GALLERY
              </span>
              <h3 className="font-oswald text-2xl font-bold text-white uppercase tracking-wide">
                {modalFilter} COLLECTION
              </h3>
            </div>

            {/* Dynamic Grid Layout: 4 Columns on Desktop with Reduced Tight Gaps */}
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 pb-16 perspective-[1000px]"
            >
              {filteredGallery.map((item, index) => (
                <ModalGalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => setSelectedPhoto(item)}
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 3. FULL-SCREEN LIGHTBOX (Rendered via React Portal at document.body level z-[100000]) */}
      {selectedPhoto && createPortal(
        <div
          data-lenis-prevent="true"
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[100000] bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn cursor-default select-none overflow-hidden"
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-40">
            {/* Left: Category & Counter */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <span className="text-[10px] sm:text-xs font-mono text-[#FF9800] font-bold tracking-widest uppercase">
                {selectedPhoto.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-[10px] sm:text-xs font-mono text-white/70 font-semibold tracking-wider">
                {filteredGallery.findIndex((p) => p.id === selectedPhoto.id) + 1} / {filteredGallery.length}
              </span>
            </div>

            {/* Right: Back to Gallery & Close Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-white/20 bg-white/10 text-[11px] sm:text-xs font-bold text-white hover:border-[#FF9800] hover:bg-[#FF9800] hover:text-black hover:shadow-[0_0_20px_rgba(255,152,0,0.5)] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">BACK TO GALLERY</span>
              </button>
              <button
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close fullscreen photo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:border-[#FF9800] hover:bg-[#FF9800] hover:text-black hover:shadow-[0_0_20px_rgba(255,152,0,0.5)] transition-all cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Previous Photograph Control Button */}
          <button
            onClick={handlePrevPhoto}
            aria-label="Previous photograph"
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-black/70 backdrop-blur-md flex items-center justify-center text-white hover:border-[#FF9800] hover:bg-[#FF9800] hover:text-black hover:shadow-[0_0_25px_rgba(255,152,0,0.6)] transition-all cursor-pointer z-40 group"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Next Photograph Control Button */}
          <button
            onClick={handleNextPhoto}
            aria-label="Next photograph"
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-black/70 backdrop-blur-md flex items-center justify-center text-white hover:border-[#FF9800] hover:bg-[#FF9800] hover:text-black hover:shadow-[0_0_25px_rgba(255,152,0,0.6)] transition-all cursor-pointer z-40 group"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Center Stage Photograph & Subtle Transition Container */}
          <div
            ref={lightboxImgRef}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-[85vw] flex flex-col items-center z-30 will-change-transform"
          >
            <img
              src={selectedPhoto.src}
              alt={`Srivathsan ${selectedPhoto.category} photograph`}
              loading="eager"
              decoding="async"
              className="max-h-[72vh] sm:max-h-[76vh] max-w-[85vw] object-contain rounded-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            />
            <div className="mt-4 sm:mt-5 text-center flex flex-col items-center">
              <span className="text-xs font-mono text-[#FF9800] uppercase tracking-widest block font-bold">
                {selectedPhoto.category}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-white/40 tracking-widest mt-1.5 uppercase">
                USE ← → ARROW KEYS OR ESC TO NAVIGATE
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
