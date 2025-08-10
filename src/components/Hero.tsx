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
    const earthRadius = Math.min(canvasWidth, canvasHeight) * 0.2; // Slightly larger Earth
    const earthX = canvasWidth * 0.5;
    const earthY = canvasHeight * 0.5;
    let earthRotationAngle = 0;

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

    // Network Nodes (major cities/hubs)
    interface NetworkNode {
      lat: number;
      lon: number;
      x: number; // calculated
      y: number; // calculated
      size: number;
      pulseOffset: number;
    }

    const networkNodes: NetworkNode[] = [
      // North America
      { lat: 34.0522, lon: -118.2437, x: 0, y: 0, size: 3, pulseOffset: Math.random() * Math.PI * 2 }, // Los Angeles
      { lat: 40.7128, lon: -74.0060, x: 0, y: 0, size: 4, pulseOffset: Math.random() * Math.PI * 2 }, // New York
      { lat: 43.6532, lon: -79.3832, x: 0, y: 0, size: 3, pulseOffset: Math.random() * Math.PI * 2 }, // Toronto
      { lat: 19.4326, lon: -99.1332, x: 0, y: 0, size: 3, pulseOffset: Math.random() * Math.PI * 2 }, // Mexico City
      // South America
      { lat: -23.5505, lon: -46.6333, x: 0, y: 0, size: 3, pulseOffset: Math.random() * Math.PI * 2 }, // Sao Paulo
      { lat: -33.4489, lon: -70.6693, x: 0, y: 0, size: 2.5, pulseOffset: Math.random() * Math.PI * 2 }, // Santiago
      // Europe
      { lat: 51.5074, lon: -0.1278, x: 0, y: 0, size: 4, pulseOffset: Math.random() * Math.PI * 2 }, // London
      { lat: 48.8566, lon: 2.3522, x: 0, y: 0, size: 3.5, pulseOffset: Math.random() * Math.PI * 2 }, // Paris
      { lat: 52.5200, lon: 13.4050, x: 0, y: 0, size: 3, pulseOffset: Math.random() * Math.PI * 2 }, // Berlin
      { lat: 41.9028, lon: 12.4964, x: 0, y: 0, size: 2.5, pulseOffset: Math.random() * Math.PI * 2 }, // Rome
      // Africa
      { lat: -26.2041, lon: 28.0473, x: 0, y: 0, size: 2.5, pulseOffset: Math.random() * Math.PI * 2 }, // Johannesburg
      { lat: 30.0444, lon: 31.2357, x: 0, y: 0, size: 3, pulseOffset: Math.random() * Math.PI * 2 }, // Cairo
      // Asia
      { lat: 35.6895, lon: 139.6917, x: 0, y: 0, size: 4, pulseOffset: Math.random() * Math.PI * 2 }, // Tokyo
      { lat: 39.9042, lon: 116.4074, x: 0, y: 0, size: 3.5, pulseOffset: Math.random() * Math.PI * 2 }, // Beijing
      { lat: 28.7041, lon: 77.1025, x: 0, y: 0, size: 3, pulseOffset: Math.random() * Math.PI * 2 }, // Delhi
      { lat: 1.3521, lon: 103.8198, x: 0, y: 0, size: 3, pulseOffset: Math.random() * Math.PI * 2 }, // Singapore
      // Australia
      { lat: -33.8688, lon: 151.2093, x: 0, y: 0, size: 3, pulseOffset: Math.random() * Math.PI * 2 }, // Sydney
    ];

    // Network Connections and Light Streaks
    interface Connection {
      from: NetworkNode;
      to: NetworkNode;
      length: number;
      streaks: LightStreak[];
    }

    interface LightStreak {
      position: number; // 0 to 1 along the connection
      speed: number;
      size: number;
      color: string;
      opacity: number;
    }

    const connections: Connection[] = [];
    const numStreaksPerConnection = 2; // Number of streaks per connection

    // Function to convert lat/lon to 3D Cartesian coordinates
    const latLonToCartesian = (lat: number, lon: number, radius: number, rotation: number) => {
      const latRad = (lat * Math.PI) / 180;
      const lonRad = (lon * Math.PI) / 180 + rotation; // Apply Earth rotation

      const x = radius * Math.cos(latRad) * Math.cos(lonRad);
      const y = radius * Math.cos(latRad) * Math.sin(lonRad);
      const z = radius * Math.sin(latRad);
      return { x, y, z };
    };

    // Function to project 3D Cartesian to 2D canvas
    const project3DTo2D = (x: number, y: number, z: number, viewDistance: number) => {
      const perspective = viewDistance / (viewDistance + z);
      return {
        x: earthX + x * perspective,
        y: earthY - y * perspective, // Invert Y for canvas coordinates
        z: z // Keep z for depth sorting
      };
    };

    // Create connections between nodes (e.g., connect each node to its 3 nearest neighbors)
    networkNodes.forEach((nodeA, i) => {
      const distances: { dist: number; node: NetworkNode }[] = [];
      networkNodes.forEach((nodeB, j) => {
        if (i !== j) {
          const dx = nodeA.lon - nodeB.lon;
          const dy = nodeA.lat - nodeB.lat;
          distances.push({ dist: Math.sqrt(dx * dx + dy * dy), node: nodeB });
        }
      });
      distances.sort((a, b) => a.dist - b.dist);

      // Connect to a few nearest neighbors
      for (let k = 0; k < Math.min(3, distances.length); k++) {
        const nodeB = distances[k].node;
        // Avoid duplicate connections (e.g., A-B and B-A)
        const exists = connections.some(conn =>
          (conn.from === nodeA && conn.to === nodeB) || (conn.from === nodeB && conn.to === nodeA)
        );
        if (!exists) {
          const newConnection: Connection = {
            from: nodeA,
            to: nodeB,
            length: distances[k].dist,
            streaks: []
          };
          for (let s = 0; s < numStreaksPerConnection; s++) {
            newConnection.streaks.push({
              position: Math.random(),
              speed: 0.01 + Math.random() * 0.02,
              size: 2 + Math.random() * 1,
              color: '#22d3ee', // Electric blue
              opacity: 0.8 + Math.random() * 0.2,
            });
          }
          connections.push(newConnection);
        }
      }
    });

    // Floating particles (ambient)
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
    const particleColors = ['#22d3ee', '#a855f7', '#ffffff']; // Cyan, Purple, White

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
      earthRotationAngle += 0.0005; // Slow rotation

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

      // Draw Earth
      // Earth base (simplified for network overlay)
      const earthGradient = ctx.createRadialGradient(
        earthX - earthRadius * 0.3, earthY - earthRadius * 0.3, 0,
        earthX, earthY, earthRadius
      );
      earthGradient.addColorStop(0, '#1e3a8a'); // blue-800
      earthGradient.addColorStop(0.5, '#0f172a'); // slate-900
      earthGradient.addColorStop(1, '#000000');

      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Earth atmospheric glow
      const atmosphereGradient = ctx.createRadialGradient(
        earthX, earthY, earthRadius,
        earthX, earthY, earthRadius + 20
      );
      atmosphereGradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)'); // Cyan glow
      atmosphereGradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.2)');
      atmosphereGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

      ctx.fillStyle = atmosphereGradient;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius + 20, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw network nodes and connections
      const viewDistance = 300; // For perspective effect

      // Calculate 3D positions and project to 2D for all nodes
      networkNodes.forEach(node => {
        const { x: cartX, y: cartY, z: cartZ } = latLonToCartesian(node.lat, node.lon, earthRadius, earthRotationAngle);
        const projected = project3DTo2D(cartX, cartY, cartZ, viewDistance);
        node.x = projected.x;
        node.y = projected.y;
        // Only draw if node is on the visible side of the Earth
        node.pulseOffset = cartZ > -earthRadius * 0.5 ? node.pulseOffset : -1; // Hide if on back side
      });

      // Sort connections by average Z-depth for correct rendering order (back to front)
      const sortedConnections = [...connections].sort((a, b) => {
        const avgZ_A = (latLonToCartesian(a.from.lat, a.from.lon, earthRadius, earthRotationAngle).z + latLonToCartesian(a.to.lat, a.to.lon, earthRadius, earthRotationAngle).z) / 2;
        const avgZ_B = (latLonToCartesian(b.from.lat, b.from.lon, earthRadius, earthRotationAngle).z + latLonToCartesian(b.to.lat, b.to.lon, earthRadius, earthRotationAngle).z) / 2;
        return avgZ_A - avgZ_B;
      });

      sortedConnections.forEach(conn => {
        const from3D = latLonToCartesian(conn.from.lat, conn.from.lon, earthRadius, earthRotationAngle);
        const to3D = latLonToCartesian(conn.to.lat, conn.to.lon, earthRadius, earthRotationAngle);

        // Only draw connections if both nodes are on the visible side
        if (from3D.z > -earthRadius * 0.5 && to3D.z > -earthRadius * 0.5) {
          const from2D = project3DTo2D(from3D.x, from3D.y, from3D.z, viewDistance);
          const to2D = project3DTo2D(to3D.x, to3D.y, to3D.z, viewDistance);

          // Draw base connection line
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)'; // Faint cyan
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(from2D.x, from2D.y);
          ctx.lineTo(to2D.x, to2D.y);
          ctx.stroke();

          // Draw light streaks
          conn.streaks.forEach(streak => {
            streak.position = (streak.position + streak.speed) % 1; // Move streak along line
            const currentX = from2D.x + (to2D.x - from2D.x) * streak.position;
            const currentY = from2D.y + (to2D.y - from2D.y) * streak.position;

            ctx.fillStyle = streak.color;
            ctx.shadowColor = streak.color;
            ctx.shadowBlur = streak.size * 3;
            ctx.globalAlpha = streak.opacity;
            ctx.beginPath();
            ctx.arc(currentX, currentY, streak.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
          });
        }
      });

      // Draw network nodes (city lights)
      networkNodes.forEach(node => {
        if (node.pulseOffset !== -1) { // Only draw if visible
          const pulse = Math.sin(time * 3 + node.pulseOffset) * 0.3 + 0.7;
          const size = node.size * pulse;
          
          ctx.fillStyle = '#ffffff'; // White core
          ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'; // Cyan glow
          ctx.shadowBlur = size * 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Update and draw ambient particles
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