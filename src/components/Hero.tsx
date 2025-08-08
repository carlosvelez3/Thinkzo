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

    // Network parameters
    const numNodes = 70;
    const connectionDistance = 200; // Max distance for nodes to connect
    const nodeColors = [
      '#22d3ee', // cyan-400
      '#a855f7', // purple-400
      '#ec4899', // pink-500
      '#34d399', // emerald-400
      '#facc15', // yellow-400
    ];

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulseOffset: number;
      connections: number[];
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }

    const nodes: Node[] = [];
    const particles: Particle[] = [];

    // Initialize nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width / (window.devicePixelRatio || 1),
        y: Math.random() * canvas.height / (window.devicePixelRatio || 1),
        vx: (Math.random() - 0.5) * 0.3, // Slower movement
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1, // Node size 1-3
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        pulseOffset: Math.random() * Math.PI * 2,
        connections: [],
      });
    }

    // Establish initial connections
    nodes.forEach((node, i) => {
      for (let j = i + 1; j < numNodes; j++) {
        const otherNode = nodes[j];
        const dist = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2));
        if (dist < connectionDistance) {
          node.connections.push(j);
          otherNode.connections.push(i); // Ensure bidirectional connection
        }
      }
    });

    const animate = () => {
      time += 0.01; // Animation speed

      // Clear canvas with a dark gradient background
      const backgroundGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      backgroundGradient.addColorStop(0, '#1e1b4b'); // navy-950
      backgroundGradient.addColorStop(1, '#000000');
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach(node => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width / (window.devicePixelRatio || 1)) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height / (window.devicePixelRatio || 1)) node.vy *= -1;

        // Node pulse effect
        const pulse = Math.sin(time * 2 + node.pulseOffset) * 0.5 + 0.5; // 0.5 to 1.5
        const currentRadius = node.radius * (1 + pulse * 0.5); // Scale radius by pulse

        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = currentRadius * 5; // Stronger glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      });

      // Draw connections and flowing particles
      ctx.lineWidth = 0.8; // Faint lines
      nodes.forEach(node => {
        node.connections.forEach(connIndex => {
          const otherNode = nodes[connIndex];
          const dist = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2));

          // Dynamic connection opacity based on distance and pulse
          const opacity = 1 - (dist / connectionDistance);
          const connectionPulse = Math.sin(time * 1.5 + node.pulseOffset + otherNode.pulseOffset) * 0.2 + 0.3; // 0.3 to 0.5
          ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * connectionPulse})`; // cyan-400 for connections
          ctx.shadowColor = `rgba(34, 211, 238, ${opacity * connectionPulse})`;
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(otherNode.x, otherNode.y);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Add flowing particles along connections
          if (Math.random() < 0.05) { // Probability of generating a particle
            particles.push({
              x: node.x,
              y: node.y,
              vx: (otherNode.x - node.x) / dist * 2, // Speed along connection
              vy: (otherNode.y - node.y) / dist * 2,
              life: 0,
              maxLife: dist / 2, // Life proportional to distance
              color: `rgba(255, 255, 255, 0.8)`, // White for flowing data
              size: Math.random() * 1.5 + 0.5, // Particle size 0.5-2
            });
          }
        });
      });

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
        ctx.fillStyle = particle.color.replace('0.8', alpha.toString());
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 3;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
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