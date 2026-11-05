import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ activeSection, scrollToSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'work', label: 'WORK' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (id) => {
    // If any gallery modal is open, close it cleanly on navigation
    if (window.closeAllModals) {
      window.closeAllModals();
    }
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-4 bg-[#08090B]/85 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
            : 'py-6 lg:py-8 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex items-center justify-between">
          {/* LEFT: Logo & Brand */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            {/* Logo Mark: Minimalist Camera Lens Aperture Ring matching reference */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white stroke-current fill-none stroke-[1.8] group-hover:text-[#FF9500] transition-colors">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.5" className="fill-white group-hover:fill-[#FF9500] transition-colors" />
              </svg>
            </div>
            <span className="font-syne font-bold text-sm sm:text-base tracking-[0.25em] text-white group-hover:text-white/90 transition-colors uppercase">
              SRIVATHSAN
            </span>
          </a>

          {/* RIGHT: Desktop Nav links + Hamburger */}
          <div className="flex items-center gap-8 lg:gap-12">
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="relative py-1 text-xs font-semibold tracking-[0.25em] transition-all cursor-pointer group"
                  >
                    <span className={isActive ? 'text-white font-bold' : 'text-[#A5A5A5] hover:text-white'}>
                      {item.label}
                    </span>
                    {/* Active Glowing Orange Indicator bar directly underneath matching reference */}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FF9500] rounded-full shadow-[0_0_8px_#FF9500] transition-all" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Circular Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:border-[#FF9500]/60 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,149,0,0.25)] transition-all cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-[#FF9500]" />
              ) : (
                <div className="w-4 h-3 flex flex-col justify-between items-center">
                  <span className="w-4 h-[1.5px] bg-white rounded-full transition-transform" />
                  <span className="w-4 h-[1.5px] bg-white/80 rounded-full" />
                  <span className="w-4 h-[1.5px] bg-white/60 rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#03050B]/95 backdrop-blur-2xl transition-all duration-500 flex flex-col justify-center px-10 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-8 max-w-md mx-auto w-full">
          <span className="text-[10px] tracking-[0.3em] text-[#A855F7] font-semibold uppercase">
            NAVIGATION
          </span>

          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="flex items-center justify-between text-2xl font-syne font-bold tracking-wider text-left text-white/80 hover:text-white hover:pl-2 transition-all border-b border-white/10 pb-4 group"
            >
              <span className="flex items-center gap-4">
                <span className="text-xs text-[#A855F7] font-mono">0{index + 1}</span>
                {item.label}
              </span>
              <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 text-[#D946EF] transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          ))}

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#85848D]">
            <span>SRIVATHSAN PHOTOGRAPHY</span>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </>
  );
}
