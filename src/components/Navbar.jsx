import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

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
            ? 'py-4 bg-[#03050B]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'py-7 bg-transparent'
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
            {/* Logo Mark: Glowing dual ring */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-purple-500/50 group-hover:border-purple-400 transition-colors animate-pulse" />
              <span className="w-3.5 h-3.5 rounded-full border border-magenta-400 border-[#D946EF] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D946EF] shadow-[0_0_8px_#D946EF]" />
              </span>
            </div>
            <span className="font-syne font-bold text-sm tracking-[0.25em] text-white group-hover:text-purple-300 transition-colors uppercase">
              SRIVATHSAN
            </span>
          </a>

          {/* RIGHT: Desktop Nav links + Hamburger */}
          <div className="flex items-center gap-8 lg:gap-12">
            <nav className="hidden md:flex items-center gap-9">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="relative py-1 text-[11px] font-semibold tracking-[0.25em] text-[#85848D] hover:text-white transition-colors cursor-pointer group"
                  >
                    <span className={isActive ? 'text-white' : ''}>{item.label}</span>
                    {/* Active Indicator dot underneath */}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D946EF] shadow-[0_0_8px_#D946EF] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Circular Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="w-10 h-10 rounded-full border border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:border-purple-500/50 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-purple-300" />
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
