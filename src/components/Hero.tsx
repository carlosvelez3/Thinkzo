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

    // Set canvas size with high DPI support
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

    // Earth properties
    const earthRadius = Math.min(canvasWidth, canvasHeight) * 0.15;
    const earthX = canvasWidth * 0.5;
    const earthY = canvasHeight * 0.5;

    // Stars
    interface Star {
      x: number;
      y: number;
      brightness: number;
      twinkleOffset: number;
      size: number;
    }

    const stars: Star[] = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        brightness: Math.random() * 0.8 + 0.2,
        twinkleOffset: Math.random() * Math.PI * 2,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    // City lights on Earth
    interface CityLight {
      angle: number;
      distance: number;
      brightness: number;
      pulseOffset: number;
      size: number;
      color: string;
    }

    const cityLights: CityLight[] = [];
    const cityColors = ['#ffffff', '#22d3ee', '#a855f7', '#ec4899'];
    
    // Create city clusters
    for (let i = 0; i < 80; i++) {
      cityLights.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * earthRadius * 0.8 + earthRadius * 0.2,
        brightness: Math.random() * 0.6 + 0.4,
        pulseOffset: Math.random() * Math.PI * 2,
        size: Math.random() * 2 + 1,
        color: cityColors[Math.floor(Math.random() * cityColors.length)],
      });
    }

    // Orbital paths and satellites
    interface OrbitalPath {
      radius: number;
      speed: number;
      angle: number;
      opacity: number;
    }

    interface Satellite {
      pathIndex: number;
      angle: number;
      speed: number;
      size: number;
      trail: { x: number; y: number; alpha: number }[];
      glowIntensity: number;
    }

    const orbitalPaths: OrbitalPath[] = [];
    const satellites: Satellite[] = [];

    // Create orbital paths
    for (let i = 0; i < 5; i++) {
      const radius = earthRadius + 60 + i * 40;
      orbitalPaths.push({
        radius,
        speed: 0.002 + Math.random() * 0.001,
        angle: Math.random() * Math.PI * 2,
        opacity: 0.15 + Math.random() * 0.1,
      });

      // Add satellite to this path
      satellites.push({
        pathIndex: i,
        angle: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.004,
        size: 3 + Math.random() * 2,
        trail: [],
        glowIntensity: 0.8 + Math.random() * 0.4,
      });
    }

    // Floating particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const particleColors = ['#22d3ee', '#a855f7', '#ec4899', '#ffffff'];

    const createParticle = () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * canvasWidth * 0.6;
      particles.push({
        x: earthX + Math.cos(angle) * distance,
        y: earthY + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        life: 0,
        maxLife: 300 + Math.random() * 200,
      });
    };

    const animate = () => {
      time += 0.008;

      // Create deep space background
      const spaceGradient = ctx.createRadialGradient(
        canvasWidth / 2, canvasHeight / 2, 0,
        canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight) / 2
      );
      spaceGradient.addColorStop(0, '#0f172a'); // slate-900
      spaceGradient.addColorStop(0.6, '#1e1b4b'); // navy-950
      spaceGradient.addColorStop(1, '#000000');
      ctx.fillStyle = spaceGradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw twinkling stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * 2 + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = star.size * 2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw orbital paths
      orbitalPaths.forEach((path, index) => {
        const pathPulse = Math.sin(time * 1.5 + index * 0.5) * 0.2 + 0.8;
        ctx.strokeStyle = `rgba(34, 211, 238, ${path.opacity * pathPulse})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.arc(earthX, earthY, path.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw Earth
      // Earth base
      const earthGradient = ctx.createRadialGradient(
        earthX - earthRadius * 0.3, earthY - earthRadius * 0.3, 0,
        earthX, earthY, earthRadius
      );
      earthGradient.addColorStop(0, '#4ade80'); // green-400
      earthGradient.addColorStop(0.3, '#22c55e'); // green-500
      earthGradient.addColorStop(0.6, '#1e40af'); // blue-700
      earthGradient.addColorStop(1, '#1e3a8a'); // blue-800

      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Earth atmospheric glow
      const atmosphereGradient = ctx.createRadialGradient(
        earthX, earthY, earthRadius,
        earthX, earthY, earthRadius + 20
      );
      atmosphereGradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
      atmosphereGradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.2)');
      atmosphereGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

      ctx.fillStyle = atmosphereGradient;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius + 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw city lights on Earth
      cityLights.forEach(city => {
        const rotatedAngle = city.angle + time * 0.3; // Earth rotation
        const x = earthX + Math.cos(rotatedAngle) * city.distance;
        const y = earthY + Math.sin(rotatedAngle) * city.distance;
        
        // Only draw cities on the visible side of Earth
        const distanceFromCenter = Math.sqrt((x - earthX) ** 2 + (y - earthY) ** 2);
        if (distanceFromCenter <= earthRadius) {
          const pulse = Math.sin(time * 2 + city.pulseOffset) * 0.3 + 0.7;
          const brightness = city.brightness * pulse;
          
          ctx.fillStyle = city.color;
          ctx.shadowColor = city.color;
          ctx.shadowBlur = city.size * 3;
          ctx.beginPath();
          ctx.arc(x, y, city.size * brightness, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Update and draw satellites
      satellites.forEach(satellite => {
        const path = orbitalPaths[satellite.pathIndex];
        satellite.angle += satellite.speed;
        
        const x = earthX + Math.cos(satellite.angle) * path.radius;
        const y = earthY + Math.sin(satellite.angle) * path.radius;

        // Add to trail
        satellite.trail.push({ x, y, alpha: 1 });
        if (satellite.trail.length > 25) {
          satellite.trail.shift();
        }

        // Draw trail
        satellite.trail.forEach((point, index) => {
          const alpha = (index / satellite.trail.length) * 0.6;
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.shadowColor = '#22d3ee';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Draw satellite
        const glowPulse = Math.sin(time * 3) * 0.2 + 0.8;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = satellite.size * 4 * glowPulse;
        ctx.beginPath();
        ctx.arc(x, y, satellite.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        const lifeRatio = particle.life / particle.maxLife;
        const currentAlpha = particle.alpha * (1 - lifeRatio);

        if (particle.life >= particle.maxLife) {
          particles.splice(index, 1);
          return;
        }

        ctx.fillStyle = particle.color.replace(')', `, ${currentAlpha})`).replace('rgb', 'rgba');
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Create new particles occasionally
      if (Math.random() < 0.03) {
        createParticle();
      }

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
      
      {/* Sophisticated overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/30 via-transparent to-navy-950/30" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-poppins text-white mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">Thinkzo.ai</span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
            <span className="font-bold text-white">Build the future, one connection at a time.</span>
          </p>
          
          <p className="text-lg sm:text-xl text-cyan-400 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            This is the Thinkzo.ai Integration Stack.
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
        
        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400/60 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mt-2 animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;