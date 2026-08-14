import React, { useEffect, useRef } from 'react';

export default function CinematicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Particles configuration (lightweight floaters, reduced on touch devices)
    const maxParticles = isTouch ? 12 : 30;
    const particlesCount = Math.min(maxParticles, Math.floor((width * height) / 30000));
    const particles = [];
    
    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.6,
        color: Math.random() > 0.4 ? 'rgba(217, 70, 239, ' : Math.random() > 0.5 ? 'rgba(168, 85, 247, ' : 'rgba(255, 154, 60, ',
        alpha: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        pulseSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    // Plus symbols grid coordinates
    const plusSymbols = [];
    const stepX = 180;
    const stepY = 200;
    for (let x = 80; x < width; x += stepX) {
      for (let y = 100; y < height; y += stepY) {
        if (Math.random() > 0.5) {
          plusSymbols.push({ x, y, alpha: Math.random() * 0.12 + 0.04 });
        }
      }
    }

    let time = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      time += 0.008;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Draw faint plus '+' marks (lightweight GPU strokes)
      ctx.strokeStyle = 'rgba(217, 70, 239, 0.12)';
      ctx.lineWidth = 1;
      plusSymbols.forEach((p) => {
        const size = 3;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.moveTo(p.x - size, p.y);
        ctx.lineTo(p.x + size, p.y);
        ctx.moveTo(p.x, p.y - size);
        ctx.lineTo(p.x, p.y + size);
        ctx.stroke();
      });
      ctx.globalAlpha = 1.0;

      // Draw flowing energy light waves (Fast linear gradient strokes with 0 shadow blur)
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseOffsetY = height * (0.25 + w * 0.26);
        const amplitude = 30 + w * 12;
        const frequency = 0.0014 - w * 0.0002;
        const colorGradient = ctx.createLinearGradient(0, 0, width, 0);

        if (w % 2 === 0) {
          colorGradient.addColorStop(0, 'rgba(168, 85, 247, 0)');
          colorGradient.addColorStop(0.3, 'rgba(168, 85, 247, 0.22)');
          colorGradient.addColorStop(0.65, 'rgba(217, 70, 239, 0.3)');
          colorGradient.addColorStop(0.85, 'rgba(255, 154, 60, 0.18)');
          colorGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        } else {
          colorGradient.addColorStop(0, 'rgba(217, 70, 239, 0)');
          colorGradient.addColorStop(0.25, 'rgba(255, 154, 60, 0.25)');
          colorGradient.addColorStop(0.6, 'rgba(192, 38, 211, 0.25)');
          colorGradient.addColorStop(0.9, 'rgba(168, 85, 247, 0.12)');
          colorGradient.addColorStop(1, 'rgba(217, 70, 239, 0)');
        }

        ctx.strokeStyle = colorGradient;
        ctx.lineWidth = 1.5;

        for (let x = 0; x <= width; x += 25) {
          const distToMouse = (x - mouseX) / width;
          const mouseOffset = Math.sin(distToMouse * Math.PI) * 12;
          const y = baseOffsetY + Math.sin(x * frequency + time + w) * amplitude + Math.cos(x * 0.001 + time * 0.8) * 16 + mouseOffset;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw floating glowing particles (Direct arc fill, no canvas shadow blur)
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(time * 5) * p.pulseSpeed;
        const currentAlpha = Math.max(0.1, Math.min(0.6, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#03050B]">
      {/* Dark Ambient Radial Gradients matching reference image */}
      <div className="absolute -top-[10%] left-[15%] w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[25%] right-[10%] w-[550px] h-[550px] bg-magenta-900/15 bg-[#D946EF]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[50%] left-[5%] w-[500px] h-[500px] bg-[#FF9A3C]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[75%] right-[15%] w-[650px] h-[650px] bg-purple-950/25 rounded-full blur-[160px] pointer-events-none" />

      {/* SVG Decorative Lines (Vertical technical grid lines) */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
        <line x1="8%" y1="0" x2="8%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" />
        <line x1="92%" y1="0" x2="92%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 8" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(168,85,247,0.05)" strokeDasharray="2 12" />
      </svg>

      {/* Canvas for dynamic light waves & floating glowing particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-40 mix-blend-overlay" />
    </div>
  );
}
