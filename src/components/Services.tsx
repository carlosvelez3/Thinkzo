import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Megaphone, Palette, Code, Search, BarChart3 } from 'lucide-react';
import StartProjectModal from './StartProjectModal';

const services = [
  {
    icon: Globe,
    title: 'AI-Powered Websites',
    description: 'Intelligent, responsive websites that adapt and learn from user behavior.',
    features: ['Neural Design', 'Smart SEO', 'Adaptive UI', 'AI Analytics']
  },
  {
    icon: Code,
    title: 'Neural Development',
    description: 'Full-stack development with machine learning integration and smart automation.',
    features: ['React/Next.js', 'AI Integration', 'Smart APIs', 'Auto-Optimization']
  },
  {
    icon: Megaphone,
    title: 'Intelligent Marketing',
    description: 'AI-driven marketing campaigns that predict and adapt to audience behavior.',
    features: ['Predictive Analytics', 'Smart Content', 'Auto-Targeting', 'Neural Insights']
  },
  {
    icon: Palette,
    title: 'Adaptive Branding',
    description: 'Dynamic brand identities that evolve with your business and market trends.',
    features: ['Smart Logos', 'Adaptive Guidelines', 'Neural Colors', 'AI Typography']
  },
  {
    icon: Search,
    title: 'Neural SEO',
    description: 'AI-powered SEO that continuously learns and optimizes for better rankings.',
    features: ['Smart Keywords', 'Auto-Optimization', 'Neural Analysis', 'Predictive SEO']
  },
  {
    icon: BarChart3,
    title: 'AI Analytics',
    description: 'Intelligent insights that predict trends and optimize performance automatically.',
    features: ['Predictive Models', 'Smart Tracking', 'Neural Insights', 'Auto-Reports']
  }
];

const Services = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
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
    const nodeCount = 30;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02
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
    const maxDistance = 120;
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance && Math.random() < 0.25) {
            node.connections.push(j);
          }
        }
      });
    });

    // Generate lightning bolt segments
    const generateLightningPath = (fromX: number, fromY: number, toX: number, toY: number) => {
      const segments = [];
      const steps = 6;
      const roughness = 0.25;
      
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let x = fromX + (toX - fromX) * t;
        let y = fromY + (toY - fromY) * t;
        
        if (i > 0 && i < steps) {
          x += (Math.random() - 0.5) * roughness * 40;
          y += (Math.random() - 0.5) * roughness * 40;
        }
        
        segments.push({ x, y });
      }
      
      return segments;
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
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
      if (Math.random() < 0.03 && lightningBolts.length < 3) {
        const fromNodeIndex = Math.floor(Math.random() * nodes.length);
        const fromNode = nodes[fromNodeIndex];
        
        if (fromNode.connections.length > 0) {
          const toNodeIndex = fromNode.connections[Math.floor(Math.random() * fromNode.connections.length)];
          const toNode = nodes[toNodeIndex];
          
          lightningBolts.push({
            fromNode: fromNodeIndex,
            toNode: toNodeIndex,
            progress: 0,
            intensity: 0.6 + Math.random() * 0.3,
            segments: generateLightningPath(fromNode.x, fromNode.y, toNode.x, toNode.y)
          });
        }
      }

      // Update and draw lightning bolts
      lightningBolts.forEach((bolt, index) => {
        bolt.progress += 0.08;
        
        if (bolt.progress > 1) {
          lightningBolts.splice(index, 1);
          return;
        }
        
        const alpha = bolt.intensity * (1 - bolt.progress);
        const segmentsToDraw = Math.floor(bolt.segments.length * bolt.progress);
        
        // Draw lightning bolt
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
        ctx.shadowBlur = 8;
        
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
        ctx.strokeStyle = `rgba(236, 72, 153, ${alpha * 0.4})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const pulseSize = 1.5 + Math.sin(node.pulse) * 0.8;
        const alpha = 0.5 + Math.sin(node.pulse) * 0.3;
        
        // Node glow
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.2})`;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core
        ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
      });

      // Draw static connections (very faint)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 0.8;
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
      <section id="services" className="relative py-32 overflow-hidden">
        {/* Neural Network Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #0f172a 100%)' }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Neural{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              AI-powered digital solutions that think, learn, and evolve with your business needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-800/50 transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl mb-6 group-hover:border-purple-400/50 transition-all duration-300"
                >
                  <service.icon className="text-purple-400" size={28} />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-xl"
            >
              Explore Neural Solutions
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Start Project Modal */}
      <StartProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Services;