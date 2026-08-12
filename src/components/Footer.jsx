import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ scrollToSection }) {
  return (
    <footer className="relative py-8 border-t border-white/10 bg-[#03050B]/90 backdrop-blur-md z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 flex items-center justify-between text-xs text-[#85848D]">
        
        {/* Left / Center Copyright */}
        <div className="flex items-center gap-4">
          <span className="font-syne font-semibold text-white/90 tracking-widest text-[11px]">
            SRIVATHSAN
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span>© 2026</span>
        </div>

        {/* Right BACK TO TOP Link */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 font-semibold tracking-[0.2em] text-white/80 hover:text-[#D946EF] transition-colors cursor-pointer group uppercase text-[11px]"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 transform group-hover:-translate-y-1 transition-transform text-[#D946EF]" />
        </button>

      </div>
    </footer>
  );
}
