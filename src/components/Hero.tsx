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

    // City lights (nodes) representing major cities
    interface CityLight {
      x: number;
      y: number;
      size: number;
      brightness: number;
      pulseOffset: number;
      color: string;
      connections: number[];
    }

    // Digital stream particles flowing between cities
    interface StreamParticle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
      color: string;
      size: number;
      trail: { x: number; y: number; alpha: number }[];
    }

    const cityColors = [
      '#22d3ee', // cyan-400
      '#a855f7', // purple-500
      '#ec4899', // pink-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
    ];

    const cities: CityLight[] = [];
    const streamParticles: StreamParticle[] = [];

    // Create city lights in realistic continental patterns
    const createCityCluster = (centerX: number, centerY: number, count: number, spread: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * spread;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        if (x > 50 && x < canvasWidth - 50 && y > 50 && y < canvasHeight - 50) {
          cities.push({
            x,
            y,
            size: Math.random() * 3 + 2,
            brightness: Math.random() * 0.5 + 0.5,
            pulseOffset: Math.random() * Math.PI * 2,
            color: cityColors[Math.floor(Math.random() * cityColors.length)],
            connections: [],
          });
        }
      }
    };

    // Create continental city clusters
    // North America
    createCityCluster(canvasWidth * 0.2, canvasHeight * 0.3, 12, 120);
    // Europe
    createCityCluster(canvasWidth * 0.55, canvasHeight * 0.25, 15, 100);
    // Asia
    createCityCluster(canvasWidth * 0.75, canvasHeight * 0.35, 18, 140);
    // South America
    createCityCluster(canvasWidth * 0.3, canvasHeight * 0.65, 8, 80);
    // Africa
    createCityCluster(canvasWidth * 0.52, canvasHeight * 0.55, 10, 90);
    // Australia
    createCityCluster(canvasWidth * 0.8, canvasHeight * 0.7, 5, 60);

    // Establish connections between cities
    cities.forEach((city, i) => {
      const maxConnections = 3;
      let connectionCount = 0;
      
      for (let j = 0; j < cities.length && connectionCount < maxConnections; j++) {
        if (i === j) continue;
        
        const otherCity = cities[j];
        const distance = Math.sqrt(
          Math.pow(city.x - otherCity.x, 2) + Math.pow(city.y - otherCity.y, 2)
        );
        
        // Connect cities within reasonable distance
        if (distance < 300 && Math.random() < 0.4) {
          city.connections.push(j);
          connectionCount++;
        }
      }
    });

    // Create initial stream particles
    const createStreamParticle = (startCity: CityLight, endCityIndex: number) => {
      const endCity = cities[endCityIndex];
      if (!endCity) return;

      streamParticles.push({
        x: startCity.x,
        y: startCity.y,
        targetX: endCity.x,
        targetY: endCity.y,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012, // Varied speed
        color: startCity.color,
        size: Math.random() * 2 + 1,
        trail: [],
      });
    };

    const animate = () => {
      time += 0.01;

      // Create dark space background with subtle Earth surface texture
      const backgroundGradient = ctx.createRadialGradient(
        canvasWidth / 2, canvasHeight / 2, 0,
        canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight) / 2
      );
      backgroundGradient.addColorStop(0, '#0f172a'); // slate-900
      backgroundGradient.addColorStop(0.7, '#1e1b4b'); // navy-950
      backgroundGradient.addColorStop(1, '#000000');
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Add subtle continent outlines
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.1)'; // navy-800 with low opacity
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);
      
      // Draw abstract continental shapes
      ctx.beginPath();
      ctx.moveTo(canvasWidth * 0.1, canvasHeight * 0.4);
      ctx.quadraticCurveTo(canvasWidth * 0.25, canvasHeight * 0.2, canvasWidth * 0.4, canvasHeight * 0.35);
      ctx.quadraticCurveTo(canvasWidth * 0.35, canvasHeight * 0.5, canvasWidth * 0.15, canvasHeight * 0.6);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(canvasWidth * 0.45, canvasHeight * 0.15);
      ctx.quadraticCurveTo(canvasWidth * 0.65, canvasHeight * 0.1, canvasWidth * 0.85, canvasHeight * 0.25);
      ctx.quadraticCurveTo(canvasWidth * 0.9, canvasHeight * 0.45, canvasWidth * 0.7, canvasHeight * 0.6);
      ctx.stroke();
      
      ctx.setLineDash([]);

      // Draw connections between cities as flowing digital streams
      cities.forEach((city, i) => {
        city.connections.forEach(connIndex => {
          const otherCity = cities[connIndex];
          if (!otherCity) return;

          // Create flowing connection line
          const connectionPulse = Math.sin(time * 2 + i * 0.5) * 0.3 + 0.7;
          const gradient = ctx.createLinearGradient(city.x, city.y, otherCity.x, otherCity.y);
          gradient.addColorStop(0, `rgba(34, 211, 238, ${connectionPulse * 0.3})`);
          gradient.addColorStop(0.5, `rgba(168, 85, 247, ${connectionPulse * 0.5})`);
          gradient.addColorStop(1, `rgba(236, 72, 153, ${connectionPulse * 0.3})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.shadowColor = city.color;
          ctx.shadowBlur = 8;
          
          ctx.beginPath();
          ctx.moveTo(city.x, city.y);
          
          // Create curved connection for more organic feel
          const midX = (city.x + otherCity.x) / 2;
          const midY = (city.y + otherCity.y) / 2 - 30;
          ctx.quadraticCurveTo(midX, midY, otherCity.x, otherCity.y);
          ctx.stroke();
          ctx.shadowBlur = 0;
        });
      });

      // Update and draw stream particles
      streamParticles.forEach((particle, index) => {
        particle.progress += particle.speed;
        
        if (particle.progress >= 1) {
          streamParticles.splice(index, 1);
          return;
        }

        // Calculate current position along the curve
        const startX = particle.x;
        const startY = particle.y;
        const endX = particle.targetX;
        const endY = particle.targetY;
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2 - 30;

        // Quadratic bezier curve interpolation
        const t = particle.progress;
        const currentX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
        const currentY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;

        // Add to trail
        particle.trail.push({ x: currentX, y: currentY, alpha: 1 });
        if (particle.trail.length > 15) {
          particle.trail.shift();
        }

        // Draw trail
        particle.trail.forEach((point, trailIndex) => {
          const alpha = (trailIndex / particle.trail.length) * point.alpha;
          ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(point.x, point.y, particle.size * alpha, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Draw main particle
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(currentX, currentY, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw city lights with pulsing effect
      cities.forEach((city, i) => {
        const pulse = Math.sin(time * 1.5 + city.pulseOffset) * 0.4 + 0.6;
        const currentSize = city.size * (0.8 + pulse * 0.4);
        const currentBrightness = city.brightness * pulse;

        // City glow
        ctx.fillStyle = city.color;
        ctx.shadowColor = city.color;
        ctx.shadowBlur = currentSize * 4;
        ctx.beginPath();
        ctx.arc(city.x, city.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${currentBrightness})`;
        ctx.beginPath();
        ctx.arc(city.x, city.y, currentSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Randomly create new stream particles
      if (Math.random() < 0.02) {
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        if (randomCity.connections.length > 0) {
          const randomConnection = randomCity.connections[Math.floor(Math.random() * randomCity.connections.length)];
          createStreamParticle(randomCity, randomConnection);
        }
      }

      // Add floating data particles in the background
      if (Math.random() < 0.1) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const size = Math.random() * 1 + 0.5;
        const color = cityColors[Math.floor(Math.random() * cityColors.length)];
        
        ctx.fillStyle = `${color}40`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
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
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-transparent to-navy-950/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/40 via-transparent to-navy-950/40" />
      
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