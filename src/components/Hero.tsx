import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let time = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const earthRadius = Math.min(canvas.width, canvas.height) * 0.15;

    // Stars
    const stars: Array<{ x: number; y: number; brightness: number; twinkle: number }> = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        brightness: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    // Satellites
    const satellites: Array<{
      angle: number;
      radius: number;
      speed: number;
      size: number;
      trail: Array<{ x: number; y: number; alpha: number }>;
    }> = [];
    
    for (let i = 0; i < 6; i++) {
      satellites.push({
        angle: (Math.PI * 2 * i) / 6,
        radius: earthRadius + 80 + Math.random() * 100,
        speed: 0.002 + Math.random() * 0.001,
        size: 3 + Math.random() * 2,
        trail: []
      });
    }

    // Network particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    // Grid lines
    const gridLines: Array<{
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      opacity: number;
      pulse: number;
    }> = [];

    // Initialize grid lines
    for (let i = 0; i < 20; i++) {
      gridLines.push({
        startX: Math.random() * canvas.width,
        startY: Math.random() * canvas.height,
        endX: Math.random() * canvas.width,
        endY: Math.random() * canvas.height,
        opacity: Math.random() * 0.3 + 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      time += 0.01;
      
      // Clear canvas with dark space background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height));
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e293b');
      gradient.addColorStop(1, '#020617');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkling effect
      stars.forEach(star => {
        const twinkle = Math.sin(time * 2 + star.twinkle) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
        ctx.fillRect(star.x, star.y, 1, 1);
        
        // Occasional bright stars
        if (star.brightness > 0.8 && twinkle > 0.9) {
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 3;
          ctx.fillRect(star.x, star.y, 1, 1);
          ctx.shadowBlur = 0;
        }
      });

      // Draw faint network grid lines
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
      ctx.lineWidth = 1;
      gridLines.forEach(line => {
        const pulseOpacity = Math.sin(time * 1.5 + line.pulse) * 0.1 + line.opacity;
        ctx.globalAlpha = pulseOpacity;
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // Draw Earth
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.1); // Slow rotation

      // Earth shadow/depth
      const earthGradient = ctx.createRadialGradient(-earthRadius * 0.3, -earthRadius * 0.3, 0, 0, 0, earthRadius);
      earthGradient.addColorStop(0, '#4ade80');
      earthGradient.addColorStop(0.3, '#22c55e');
      earthGradient.addColorStop(0.7, '#16a34a');
      earthGradient.addColorStop(1, '#15803d');
      
      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(0, 0, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Earth continents (simplified)
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.arc(-earthRadius * 0.2, -earthRadius * 0.3, earthRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(earthRadius * 0.3, earthRadius * 0.1, earthRadius * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-earthRadius * 0.1, earthRadius * 0.4, earthRadius * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // City lights (night side)
      ctx.fillStyle = '#fbbf24';
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * earthRadius * 0.8;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const size = Math.random() * 1.5 + 0.5;
        
        ctx.globalAlpha = Math.random() * 0.8 + 0.2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.restore();

      // Earth atmospheric glow
      const atmosphereGradient = ctx.createRadialGradient(centerX, centerY, earthRadius, centerX, centerY, earthRadius + 30);
      atmosphereGradient.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
      atmosphereGradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.1)');
      atmosphereGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = atmosphereGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius + 30, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw satellites with trails
      satellites.forEach(satellite => {
        satellite.angle += satellite.speed;
        
        const x = centerX + Math.cos(satellite.angle) * satellite.radius;
        const y = centerY + Math.sin(satellite.angle) * satellite.radius;

        // Add to trail
        satellite.trail.push({ x, y, alpha: 1 });
        if (satellite.trail.length > 50) {
          satellite.trail.shift();
        }

        // Draw trail
        satellite.trail.forEach((point, index) => {
          const alpha = (index / satellite.trail.length) * 0.6;
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw satellite
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, satellite.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Satellite glow
        const satGradient = ctx.createRadialGradient(x, y, 0, x, y, satellite.size * 3);
        satGradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
        satGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = satGradient;
        ctx.beginPath();
        ctx.arc(x, y, satellite.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add network particles
      if (Math.random() < 0.3) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 0,
          maxLife: 100 + Math.random() * 100
        });
      }

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        if (particle.life > particle.maxLife) {
          particles.splice(index, 1);
          return;
        }

        const alpha = 1 - (particle.life / particle.maxLife);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Overlay Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-transparent to-navy-950/80" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-poppins text-white mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">Thinkzo.ai</span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
            <span className="font-bold text-white">Unleash AI-powered insights and automation.</span> Build, deploy and scale intelligent applications <span className="font-bold text-cyan-300">without limits.</span>
          </p>
          
          <div className="animate-slide-up">
            <button
              onClick={scrollToPricing}
              className="btn-primary inline-flex items-center gap-3 text-lg"
            >
              Get Started Today
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;