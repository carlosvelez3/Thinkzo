import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import StartProjectModal from './StartProjectModal';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Neural network nodes
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      connections: number[];
      pulse: number;
      pulseSpeed: number;
    }> = [];

    // Create nodes
    const nodeCount = 50;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }

    // Lightning bolts
    const lightningBolts: Array<{
      fromNode: number;
      toNode: number;
      progress: number;
      intensity: number;
      segments: Array<{ x: number; y: number }>;
    }> = [];

    // Create connections between nearby nodes
    const maxDistance = 150;
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance && Math.random() < 0.3) {
            node.connections.push(j);
          }
        }
      });
    });

    // Generate lightning bolt segments
    const generateLightningPath = (fromX: number, fromY: number, toX: number, toY: number) => {
      const segments = [];
      const steps = 8;
      const roughness = 0.3;
      
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let x = fromX + (toX - fromX) * t;
        let y = fromY + (toY - fromY) * t;
        
        if (i > 0 && i < steps) {
          x += (Math.random() - 0.5) * roughness * 50;
          y += (Math.random() - 0.5) * roughness * 50;
        }
        
        segments.push({ x, y });
      }
      
      return segments;
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update nodes
      nodes.forEach((node, i) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
        
        // Update pulse
        node.pulse += node.pulseSpeed;
      });

      // Randomly create lightning bolts
      if (Math.random() < 0.05 && lightningBolts.length < 5) {
        const fromNodeIndex = Math.floor(Math.random() * nodes.length);
        const fromNode = nodes[fromNodeIndex];
        
        if (fromNode.connections.length > 0) {
          const toNodeIndex = fromNode.connections[Math.floor(Math.random() * fromNode.connections.length)];
          const toNode = nodes[toNodeIndex];
          
          lightningBolts.push({
            fromNode: fromNodeIndex,
            toNode: toNodeIndex,
            progress: 0,
            intensity: 0.8 + Math.random() * 0.2,
            segments: generateLightningPath(fromNode.x, fromNode.y, toNode.x, toNode.y)
          });
        }
      }

      // Update and draw lightning bolts
      lightningBolts.forEach((bolt, index) => {
        bolt.progress += 0.1;
        
        if (bolt.progress > 1) {
          lightningBolts.splice(index, 1);
          return;
        }
        
        const alpha = bolt.intensity * (1 - bolt.progress);
        const segmentsToDraw = Math.floor(bolt.segments.length * bolt.progress);
        
        // Draw lightning bolt
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        for (let i = 0; i < segmentsToDraw - 1; i++) {
          const segment = bolt.segments[i];
          const nextSegment = bolt.segments[i + 1];
          
          if (i === 0) {
            ctx.moveTo(segment.x, segment.y);
          }
          ctx.lineTo(nextSegment.x, nextSegment.y);
        }
        ctx.stroke();
        
        // Add glow effect
        ctx.strokeStyle = `rgba(236, 72, 153, ${alpha * 0.5})`;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 20;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const pulseSize = 2 + Math.sin(node.pulse) * 1;
        const alpha = 0.6 + Math.sin(node.pulse) * 0.4;
        
        // Node glow
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.3})`;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core
        ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
      });

      // Draw static connections (faint)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
      ctx.lineWidth = 1;
      nodes.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const connectedNode = nodes[connectionIndex];
          const dx = node.x - connectedNode.x;
          const dy = node.y - connectedNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
        {/* Neural Network Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-slate-900/80" />

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-16 text-purple-400 z-10"
        >
          <Sparkles size={32} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-16 text-pink-400 z-10"
        >
          <Zap size={28} />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2 text-purple-300 text-sm font-medium backdrop-blur-xl">
              <Sparkles size={16} />
              <span>Neural-Powered Digital Solutions</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
          >
            We Design{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligent
            </span>{' '}
            Experiences
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            From AI-powered websites to neural marketing campaigns, we craft digital solutions 
            that think, adapt, and evolve with your business needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 inline-flex items-center space-x-2 backdrop-blur-xl"
            >
              <span>Start Your Project</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-slate-400/50 rounded-full flex justify-center backdrop-blur-xl">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Start Project Modal */}
      <StartProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Hero;