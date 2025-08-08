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

    // Animation variables
    let time = 0;
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const earthRadius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.12;

    // Enhanced stars with depth layers
    const stars: Array<{ 
      x: number; 
      y: number; 
      brightness: number; 
      twinkle: number;
      size: number;
      layer: number;
    }> = [];
    
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        brightness: Math.random() * 0.9 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        size: Math.random() * 2 + 0.5,
        layer: Math.random() < 0.1 ? 2 : 1 // 10% are brighter background stars
      });
    }

    // Enhanced satellites with data transmission
    const satellites: Array<{
      angle: number;
      radius: number;
      speed: number;
      size: number;
      trail: Array<{ x: number; y: number; alpha: number }>;
      dataBeams: Array<{
        targetX: number;
        targetY: number;
        progress: number;
        active: boolean;
      }>;
      lastBeamTime: number;
    }> = [];
    
    for (let i = 0; i < 8; i++) {
      satellites.push({
        angle: (Math.PI * 2 * i) / 8,
        radius: earthRadius + 60 + Math.random() * 120,
        speed: 0.0008 + Math.random() * 0.0006,
        size: 2.5 + Math.random() * 1.5,
        trail: [],
        dataBeams: [],
        lastBeamTime: 0
      });
    }

    // Network grid system
    const networkNodes: Array<{
      x: number;
      y: number;
      connections: number[];
      pulse: number;
      activity: number;
    }> = [];

    // Create network nodes
    for (let i = 0; i < 25; i++) {
      networkNodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        activity: Math.random()
      });
    }

    // Connect nearby nodes
    networkNodes.forEach((node, i) => {
      networkNodes.forEach((otherNode, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + 
            Math.pow(node.y - otherNode.y, 2)
          );
          if (distance < 150 && Math.random() < 0.3) {
            node.connections.push(j);
          }
        }
      });
    });

    // Floating particles for data flow
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }> = [];

    // Earth city lights data
    const cityLights: Array<{
      x: number;
      y: number;
      brightness: number;
      flicker: number;
    }> = [];

    // Generate city lights on Earth surface
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * earthRadius * 0.85;
      cityLights.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        brightness: Math.random() * 0.8 + 0.2,
        flicker: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      time += 0.008; // Slower, more elegant motion
      
      // Create deep space background
      const spaceGradient = ctx.createRadialGradient(
        centerX, centerY, 0, 
        centerX, centerY, Math.max(canvas.offsetWidth, canvas.offsetHeight)
      );
      spaceGradient.addColorStop(0, '#0a0a0f');
      spaceGradient.addColorStop(0.3, '#0f0f1a');
      spaceGradient.addColorStop(0.7, '#1a1a2e');
      spaceGradient.addColorStop(1, '#000000');
      ctx.fillStyle = spaceGradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw layered stars with depth
      stars.forEach(star => {
        const twinkle = Math.sin(time * 1.5 + star.twinkle) * 0.4 + 0.6;
        const alpha = star.brightness * twinkle * (star.layer === 2 ? 1.2 : 0.8);
        
        if (star.layer === 2) {
          // Bright background stars
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = star.size * 2;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        } else {
          // Regular stars
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw network grid connections
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      ctx.lineWidth = 1;
      networkNodes.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const targetNode = networkNodes[connectionIndex];
          const pulseIntensity = Math.sin(time * 2 + node.pulse) * 0.3 + 0.7;
          
          ctx.globalAlpha = 0.05 * pulseIntensity;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        });
      });
      ctx.globalAlpha = 1;

      // Draw network nodes
      networkNodes.forEach(node => {
        const pulse = Math.sin(time * 1.8 + node.pulse) * 0.5 + 0.5;
        const size = 1 + pulse * 1.5;
        
        ctx.fillStyle = `rgba(34, 211, 238, ${0.3 + pulse * 0.4})`;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = size * 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Earth with enhanced details
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.05); // Very slow rotation

      // Earth main body with realistic gradient
      const earthGradient = ctx.createRadialGradient(
        -earthRadius * 0.4, -earthRadius * 0.4, 0, 
        0, 0, earthRadius
      );
      earthGradient.addColorStop(0, '#4ade80');
      earthGradient.addColorStop(0.2, '#22c55e');
      earthGradient.addColorStop(0.5, '#16a34a');
      earthGradient.addColorStop(0.8, '#15803d');
      earthGradient.addColorStop(1, '#0f3d1a');
      
      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(0, 0, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Continental landmasses
      ctx.fillStyle = '#166534';
      ctx.globalAlpha = 0.8;
      
      // North America
      ctx.beginPath();
      ctx.arc(-earthRadius * 0.3, -earthRadius * 0.4, earthRadius * 0.25, 0, Math.PI * 2);
      ctx.fill();
      
      // Europe/Africa
      ctx.beginPath();
      ctx.arc(earthRadius * 0.1, -earthRadius * 0.2, earthRadius * 0.2, 0, Math.PI * 2);
      ctx.fill();
      
      // Asia
      ctx.beginPath();
      ctx.arc(earthRadius * 0.4, -earthRadius * 0.1, earthRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Australia
      ctx.beginPath();
      ctx.arc(earthRadius * 0.3, earthRadius * 0.4, earthRadius * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 1;

      // Enhanced city lights
      cityLights.forEach(light => {
        const flicker = Math.sin(time * 3 + light.flicker) * 0.3 + 0.7;
        const brightness = light.brightness * flicker;
        
        ctx.fillStyle = `rgba(255, 200, 100, ${brightness})`;
        ctx.shadowColor = '#ffc107';
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(light.x, light.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Ocean reflections
      ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * earthRadius * 0.7;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Enhanced atmospheric glow
      const atmosphereGradient = ctx.createRadialGradient(
        centerX, centerY, earthRadius, 
        centerX, centerY, earthRadius + 40
      );
      atmosphereGradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
      atmosphereGradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.2)');
      atmosphereGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = atmosphereGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius + 40, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw satellites with data beams
      satellites.forEach(satellite => {
        satellite.angle += satellite.speed;
        
        const x = centerX + Math.cos(satellite.angle) * satellite.radius;
        const y = centerY + Math.sin(satellite.angle) * satellite.radius;

        // Add to trail with gradient effect
        satellite.trail.push({ x, y, alpha: 1 });
        if (satellite.trail.length > 80) {
          satellite.trail.shift();
        }

        // Draw enhanced trail
        satellite.trail.forEach((point, index) => {
          const alpha = (index / satellite.trail.length) * 0.8;
          const size = alpha * 2;
          
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.shadowColor = '#22d3ee';
          ctx.shadowBlur = size * 2;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Generate data beams to Earth
        if (time - satellite.lastBeamTime > 2 + Math.random() * 3) {
          const earthAngle = Math.random() * Math.PI * 2;
          const earthDistance = Math.random() * earthRadius * 0.8;
          satellite.dataBeams.push({
            targetX: centerX + Math.cos(earthAngle) * earthDistance,
            targetY: centerY + Math.sin(earthAngle) * earthDistance,
            progress: 0,
            active: true
          });
          satellite.lastBeamTime = time;
        }

        // Update and draw data beams
        satellite.dataBeams.forEach((beam, beamIndex) => {
          if (beam.active) {
            beam.progress += 0.03;
            
            if (beam.progress >= 1) {
              beam.active = false;
              satellite.dataBeams.splice(beamIndex, 1);
              return;
            }

            const beamX = x + (beam.targetX - x) * beam.progress;
            const beamY = y + (beam.targetY - y) * beam.progress;
            
            // Draw data beam
            ctx.strokeStyle = `rgba(168, 85, 247, ${1 - beam.progress})`;
            ctx.lineWidth = 2;
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(beamX, beamY);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw beam particle
            ctx.fillStyle = `rgba(168, 85, 247, ${1 - beam.progress})`;
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(beamX, beamY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });

        // Draw enhanced satellite
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, satellite.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Satellite pulse glow
        const pulseSize = satellite.size + Math.sin(time * 4) * 2;
        const pulseGradient = ctx.createRadialGradient(x, y, 0, x, y, pulseSize * 2);
        pulseGradient.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
        pulseGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = pulseGradient;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add floating data particles
      if (Math.random() < 0.4) {
        const colors = ['rgba(34, 211, 238, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(236, 72, 153, 0.8)'];
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 0,
          maxLife: 150 + Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2 + 1
        });
      }

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        if (particle.life > particle.maxLife || 
            particle.x < 0 || particle.x > canvas.offsetWidth ||
            particle.y < 0 || particle.y > canvas.offsetHeight) {
          particles.splice(index, 1);
          return;
        }

        const alpha = 1 - (particle.life / particle.maxLife);
        const size = particle.size * alpha;
        
        ctx.fillStyle = particle.color.replace('0.8', alpha.toString());
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = size * 2;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
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
      {/* Enhanced Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Sophisticated overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/20 via-transparent to-navy-950/20" />
      
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