import React, { useEffect, useRef } from 'react';
import { ArrowRight, Brain } from 'lucide-react';

declare global {
  interface Window {
    VANTA: any;
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }
}

const Hero: React.FC = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const neuralNetworkRef = useRef<HTMLDivElement>(null);

  // Helper function to create connections between neurons
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createConnection = (neuron1: any, neuron2: any, container: HTMLElement) => {
    const connection = document.createElement('div');
    const angle = Math.atan2(neuron2.y - neuron1.y, neuron2.x - neuron1.x);
    const length = Math.sqrt(
      Math.pow(neuron2.x - neuron1.x, 2) + 
      Math.pow(neuron2.y - neuron1.y, 2)
    );
    
    connection.className = 'neural-connection';
    connection.style.cssText = `
      position: absolute;
      left: ${neuron1.x}px;
      top: ${neuron1.y}px;
      
      width: ${length}px;
      height: 4px;
      background: linear-gradient(90deg, 
        rgba(34, 211, 238, 0.2) 0%, 
        rgba(34, 211, 238, 1) 20%,
        rgba(255, 255, 255, 1) 40%,
        rgba(6, 182, 212, 1) 60%,
        rgba(34, 211, 238, 1) 80%,
        rgba(34, 211, 238, 0.2) 100%);
      transform-origin: 0 50%;
      transform: rotate(${angle}rad);
      pointer-events: none;
      z-index: 2;
      border-radius: 2px;
      box-shadow: 
        0 0 15px rgba(34, 211, 238, 0.8),
        0 0 30px rgba(6, 182, 212, 0.6),
        0 0 45px rgba(14, 116, 144, 0.4),
        inset 0 0 10px rgba(255, 255, 255, 0.3);
      animation: electric-connection-pulse 2s ease-in-out infinite, electric-flicker 0.5s ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
    `;
    
    container.appendChild(connection);
  };
  
  // Helper function to create traveling signals
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createTravelingSignal = (startNeuron: any, endNeuron: any, container: HTMLElement) => {
    const signal = document.createElement('div');
    
    signal.className = 'neural-signal';
    signal.style.cssText = `
      position: absolute;
      left: ${startNeuron.x}px;
      top: ${startNeuron.y}px;
      width: 12px;
      height: 12px;
      background: radial-gradient(circle, 
        #ffffff 0%,
        #ffffff 10%, 
        #22d3ee 30%, 
        #06b6d4 50%, 
        #0891b2 70%, 
        rgba(34, 211, 238, 0.9) 90%,
        transparent 100%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 4;
      box-shadow: 
        0 0 20px #ffffff,
        0 0 40px #22d3ee,
        0 0 60px #06b6d4,
        0 0 80px #0891b2;
      transform: translate(-6px, -6px);
      animation: signal-energy-pulse 0.3s ease-in-out infinite;
    `;
    
    container.appendChild(signal);
    
    // Calculate travel path
    const distance = Math.sqrt(
      Math.pow(endNeuron.x - startNeuron.x, 2) + 
      Math.pow(endNeuron.y - startNeuron.y, 2)
    );
    const duration = Math.max(0.8, distance / 200);
    
    signal.style.transition = `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    
    setTimeout(() => {
      signal.style.left = endNeuron.x + 'px';
      signal.style.top = endNeuron.y + 'px';
      signal.style.transform = 'translate(-6px, -6px) scale(3)';
      signal.style.filter = 'brightness(3) saturate(2)';
      
      // Enhanced destination neuron activation
      endNeuron.element.style.animation = 'electric-neuron-activate 0.8s ease-out';
      endNeuron.element.style.filter = 'brightness(3) saturate(2) contrast(1.5)';
      
      setTimeout(() => {
        signal.remove();
        endNeuron.element.style.animation = 'electric-neuron-pulse 2s ease-in-out infinite, brain-rotate 8s linear infinite';
        endNeuron.element.style.filter = 'brightness(1)';
      }, duration * 1000);
    }, 100);
  };

  // Main function to create the neural network
  const createNeuralNetwork = () => {
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop || !neuralNetworkRef.current) return;

    const container = neuralNetworkRef.current;
    
    // Clear any existing neural elements
    container.innerHTML = '';
    
    const neurons: Array<{ x: number; y: number; element: HTMLElement }> = [];
    
    // Create enhanced brain neurons
    for (let i = 0; i < 15; i++) {
      const neuron = document.createElement('div');
      const x = Math.random() * (container.offsetWidth - 80) + 40;
      const y = Math.random() * (container.offsetHeight - 80) + 40;
      const size = 20 + Math.random() * 12; // Larger for more energy
      
      // Define color schemes for different brain neurons
      const colorSchemes = [
        { color: '#00ffff', glow: 'rgba(0, 255, 255, 0.9)' }, // Electric Cyan
        { color: '#ff00ff', glow: 'rgba(255, 0, 255, 0.9)' }, // Electric Magenta
        { color: '#ffff00', glow: 'rgba(255, 255, 0, 0.9)' }, // Electric Yellow
        { color: '#00ff00', glow: 'rgba(0, 255, 0, 0.9)' }, // Electric Green
        { color: '#ff6600', glow: 'rgba(255, 102, 0, 0.9)' }, // Electric Orange
        { color: '#6600ff', glow: 'rgba(102, 0, 255, 0.9)' }, // Electric Purple
        { color: '#ff0066', glow: 'rgba(255, 0, 102, 0.9)' }, // Electric Pink
        { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.9)' }  // Electric White
      ];
      const colorScheme = colorSchemes[i % colorSchemes.length];
      
      neuron.className = 'neural-node';
      neuron.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${colorScheme.color};
        box-shadow: 
          0 0 20px ${colorScheme.glow},
          0 0 40px ${colorScheme.glow},
          0 0 60px ${colorScheme.glow},
          0 0 80px ${colorScheme.glow},
          inset 0 0 10px rgba(255, 255, 255, 0.3);
        animation: electric-neuron-pulse 2s ease-in-out infinite, brain-rotate 6s linear infinite, electric-flicker 0.8s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s, ${Math.random() * 8}s;
        filter: drop-shadow(0 0 15px ${colorScheme.glow}) brightness(1.2) saturate(1.5);
        transform-origin: center;
      `;
      
      // Add brain icon to the neuron
      const brainIcon = document.createElement('div');
      brainIcon.innerHTML = `
        <svg width="${size * 0.7}" height="${size * 0.7}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
          <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
          <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
          <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
          <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
          <path d="M6 18a4 4 0 0 1-1.967-.516"/>
          <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
        </svg>
      `;
      brainIcon.style.cssText = `
        pointer-events: none;
        opacity: 1;
        animation: brain-pulse 1.5s ease-in-out infinite, electric-shimmer 2s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
        filter: drop-shadow(0 0 5px currentColor);
      `;
      
      neuron.appendChild(brainIcon);
      container.appendChild(neuron);
      neurons.push({ x: x + size/2, y: y + size/2, element: neuron });
    }
    
    // Create intelligent connections
    neurons.forEach((neuron1, i) => {
      neurons.forEach((neuron2, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(neuron1.x - neuron2.x, 2) + 
            Math.pow(neuron1.y - neuron2.y, 2)
          );
          
          // Enhanced connection logic with distance-based probability
          const connectionProbability = Math.max(0, 1 - (distance / 200));
          if (distance < 200 && Math.random() < connectionProbability * 0.6) {
            createConnection(neuron1, neuron2, container);
          }
        }
      });
    });
    
    // Enhanced signal generation system
    const createSignalLoop = () => {
      if (Math.random() > 0.1) { // 90% chance to create signal - much more active
        const startNeuron = neurons[Math.floor(Math.random() * neurons.length)];
        const nearbyNeurons = neurons.filter(n => {
          const distance = Math.sqrt(
            Math.pow(startNeuron.x - n.x, 2) + 
            Math.pow(startNeuron.y - n.y, 2)
          );
          return distance < 200 && n !== startNeuron;
        });
        
        if (nearbyNeurons.length > 0) {
          const endNeuron = nearbyNeurons[Math.floor(Math.random() * nearbyNeurons.length)];
          createTravelingSignal(startNeuron, endNeuron, container);
        }
      }
      
      // More frequent signal generation
      setTimeout(createSignalLoop, 300 + Math.random() * 600);
    };
    
    // Start the enhanced signal system
    setTimeout(createSignalLoop, 500);
  };

  useEffect(() => {
    // Check if we're on desktop and Vanta is available
    const isDesktop = window.innerWidth >= 768;
    
    if (isDesktop && window.VANTA && vantaRef.current) {
      vantaEffect.current = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x22d3ee,
        backgroundColor: 0x0f172a,
        points: 8.00,
        maxDistance: 25.00,
        spacing: 25.00,
        showDots: true,
        forceAnimate: true,
        waveHeight: 12.00,
        waveSpeed: 0.85,
        zoom: 0.80
      });
    }
    
    // Create enhanced neural network overlay (separate from Vanta)
    if (isDesktop) {
      setTimeout(() => {
        createNeuralNetwork();
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
      if (neuralNetworkRef.current) {
        neuralNetworkRef.current.innerHTML = '';
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
      {/* Vanta.js Background */}
      <div 
        ref={vantaRef} 
        className="absolute inset-0 hidden md:block"
      />
      
      {/* Enhanced Neural Network Overlay */}
      <div 
        ref={neuralNetworkRef}
        className="absolute inset-0 hidden md:block pointer-events-none"
      />
      
      {/* Floating Electric Brains */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, index) => {
          const colorSchemes = [
            { brain: 'text-cyan-400/70', spark: 'bg-cyan-300', glow: 'rgba(34, 211, 238, 0.6)' },
            { brain: 'text-purple-400/70', spark: 'bg-purple-300', glow: 'rgba(168, 85, 247, 0.6)' },
            { brain: 'text-pink-400/70', spark: 'bg-pink-300', glow: 'rgba(244, 114, 182, 0.6)' },
            { brain: 'text-emerald-400/70', spark: 'bg-emerald-300', glow: 'rgba(52, 211, 153, 0.6)' },
            { brain: 'text-yellow-400/70', spark: 'bg-yellow-300', glow: 'rgba(251, 191, 36, 0.6)' },
            { brain: 'text-indigo-400/70', spark: 'bg-indigo-300', glow: 'rgba(129, 140, 248, 0.6)' }
          ];
          const colorScheme = colorSchemes[index % colorSchemes.length];
          
          return (
          <div
            key={index}
            className="absolute animate-float-brain opacity-60"
            style={{
              left: `${10 + (index * 15)}%`,
              top: `${20 + (index % 3) * 25}%`,
              animationDelay: `${index * 1.2}s`,
              animationDuration: `${4 + (index % 3)}s`
            }}
          >
            <div className="relative">
              <Brain 
                size={24 + (index % 3) * 8} 
                className={`${colorScheme.brain} filter drop-shadow-lg animate-electric-pulse`}
                style={{
                  animationDelay: `${index * 0.8}s`,
                  filter: `drop-shadow(0 0 8px ${colorScheme.glow}) drop-shadow(0 0 16px ${colorScheme.glow})`
                }}
              />
              {/* Electric sparks around brain */}
              <div className="absolute inset-0">
                {[...Array(4)].map((_, sparkIndex) => (
                  <div
                    key={sparkIndex}
                    className={`absolute w-1 h-1 ${colorScheme.spark} rounded-full animate-electric-spark`}
                    style={{
                      left: `${20 + sparkIndex * 15}%`,
                      top: `${15 + sparkIndex * 20}%`,
                      animationDelay: `${(index + sparkIndex) * 0.3}s`,
                      boxShadow: '0 0 4px currentColor'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );})}
      </div>
      
      {/* Mobile Fallback Background */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/30 to-navy-950/80" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-poppins text-white mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">Thinkzo.ai</span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
            <span className="font-semibold text-white">Unleash AI-powered insights and automation.</span> Build, deploy and scale intelligent applications <span className="font-bold text-cyan-300">without limits.</span>
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
