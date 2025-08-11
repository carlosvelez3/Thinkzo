import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Create and inject the animated banner styles and script
    const style = document.createElement('style');
    style.textContent = `
      .animated-banner-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse at center, #001133 0%, #000011 70%, #000000 100%);
        overflow: hidden;
      }

      .digital-grid {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotateX(60deg) rotateZ(45deg);
        width: 200vw;
        height: 200vh;
        perspective: 1000px;
        transform-style: preserve-3d;
      }

      .grid-layer {
        position: absolute;
        width: 100%;
        height: 100%;
        animation: floatLayer 8s ease-in-out infinite;
      }

      .grid-layer:nth-child(1) { animation-delay: 0s; z-index: 3; }
      .grid-layer:nth-child(2) { animation-delay: -2s; z-index: 2; }
      .grid-layer:nth-child(3) { animation-delay: -4s; z-index: 1; }

      .animated-square {
        position: absolute;
        border: 2px solid;
        background: rgba(0, 100, 255, 0.1);
        backdrop-filter: blur(1px);
        animation: cleanPulse 6s ease-in-out infinite;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .animated-square:nth-child(odd) {
        animation: cleanPulseReverse 6s ease-in-out infinite;
      }

      .animated-square.type-1 {
        border-color: #0066ff;
        box-shadow: 0 0 20px rgba(0, 102, 255, 0.5), inset 0 0 20px rgba(0, 102, 255, 0.1);
      }

      .animated-square.type-2 {
        border-color: #00ccff;
        box-shadow: 0 0 25px rgba(0, 204, 255, 0.6), inset 0 0 15px rgba(0, 204, 255, 0.2);
      }

      .animated-square.type-3 {
        border-color: #ff0099;
        box-shadow: 0 0 30px rgba(255, 0, 153, 0.4), inset 0 0 10px rgba(255, 0, 153, 0.15);
      }

      .animated-square.type-4 {
        border-color: #00ff88;
        box-shadow: 0 0 15px rgba(0, 255, 136, 0.7), inset 0 0 25px rgba(0, 255, 136, 0.1);
      }

      .animated-square.highlight {
        background: rgba(255, 255, 255, 0.2);
        border-width: 3px;
        animation: magneticHighlight 8s ease-in-out infinite;
      }

      .animated-square.magnetic {
        animation: magneticAttraction 4s ease-in-out infinite;
        transform-origin: center;
      }

      .animated-square.cluster {
        animation: clusterMovement 10s ease-in-out infinite;
      }

      .animated-particles {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .animated-particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: #fff;
        border-radius: 50%;
        animation: floatParticle 6s linear infinite;
        opacity: 0.8;
      }

      @keyframes floatLayer {
        0%, 100% { transform: translateZ(0px) rotateZ(0deg); }
        25% { transform: translateZ(15px) rotateZ(1deg); }
        50% { transform: translateZ(-5px) rotateZ(-0.5deg); }
        75% { transform: translateZ(10px) rotateZ(0.5deg); }
      }

      @keyframes cleanPulse {
        0%, 100% { 
          opacity: 0.6; 
          transform: scale(1) rotateZ(0deg) translateX(0) translateY(0);
          filter: brightness(1);
        }
        25% { 
          opacity: 0.8; 
          transform: scale(1.02) rotateZ(1deg) translateX(2px) translateY(-2px);
          filter: brightness(1.1);
        }
        50% {
          opacity: 1; 
          transform: scale(1.08) rotateZ(0deg) translateX(0) translateY(0);
          filter: brightness(1.3);
        }
        75% { 
          opacity: 0.8; 
          transform: scale(1.02) rotateZ(-1deg) translateX(-2px) translateY(2px);
          filter: brightness(1.1);
        }
      }

      @keyframes cleanPulseReverse {
        0%, 100% { 
          opacity: 1; 
          transform: scale(1.03) rotateZ(0deg) translateX(0) translateY(0);
          filter: brightness(1.2);
        }
        25% { 
          opacity: 0.7; 
          transform: scale(0.98) rotateZ(-1deg) translateX(-3px) translateY(3px);
          filter: brightness(0.9);
        }
        50% { 
          opacity: 0.4; 
          transform: scale(0.92) rotateZ(0deg) translateX(0) translateY(0);
          filter: brightness(0.8);
        }
        75% { 
          opacity: 0.7; 
          transform: scale(0.98) rotateZ(1deg) translateX(3px) translateY(-3px);
          filter: brightness(0.9);
        }
      }

      @keyframes magneticHighlight {
        0%, 100% { 
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.1);
          transform: scale(1) translateX(0) translateY(0);
        }
        25% { 
          box-shadow: 0 0 40px rgba(255, 255, 255, 0.5), inset 0 0 40px rgba(255, 255, 255, 0.2);
          transform: scale(1.05) translateX(5px) translateY(-5px);
        }
        50% { 
          box-shadow: 0 0 50px rgba(255, 255, 255, 0.8), inset 0 0 50px rgba(255, 255, 255, 0.3);
          transform: scale(1.15) translateX(0) translateY(0);
        }
        75% { 
          box-shadow: 0 0 40px rgba(255, 255, 255, 0.5), inset 0 0 40px rgba(255, 255, 255, 0.2);
          transform: scale(1.05) translateX(-5px) translateY(5px);
        }
      }

      @keyframes magneticAttraction {
        0%, 100% { 
          transform: scale(1) translateX(0) translateY(0) rotateZ(0deg);
        }
        20% { 
          transform: scale(1.1) translateX(10px) translateY(-10px) rotateZ(5deg);
        }
        40% { 
          transform: scale(0.9) translateX(-8px) translateY(8px) rotateZ(-3deg);
        }
        60% { 
          transform: scale(1.05) translateX(12px) translateY(5px) rotateZ(2deg);
        }
        80% { 
          transform: scale(0.95) translateX(-5px) translateY(-12px) rotateZ(-4deg);
        }
      }

      @keyframes clusterMovement {
        0%, 100% { 
          transform: scale(1) translateX(0) translateY(0) rotateZ(0deg);
        }
        10% { 
          transform: scale(1.02) translateX(15px) translateY(-8px) rotateZ(2deg);
        }
        25% { 
          transform: scale(0.98) translateX(25px) translateY(-15px) rotateZ(4deg);
        }
        40% { 
          transform: scale(1.05) translateX(20px) translateY(-20px) rotateZ(1deg);
        }
        55% { 
          transform: scale(0.95) translateX(5px) translateY(-10px) rotateZ(-2deg);
        }
        70% { 
          transform: scale(1.03) translateX(-10px) translateY(5px) rotateZ(-3deg);
        }
        85% { 
          transform: scale(0.97) translateX(-5px) translateY(10px) rotateZ(1deg);
        }
      }

      @keyframes floatParticle {
        0% {
          transform: translateY(100vh) translateX(0);
          opacity: 0;
        }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% {
          transform: translateY(-100px) translateX(100px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Create animated elements
    const createSquares = () => {
      const layers = document.querySelectorAll('.grid-layer');
      const types = ['type-1', 'type-2', 'type-3', 'type-4'];
      
      layers.forEach((layer, layerIndex) => {
        const squareCount = 35 - (layerIndex * 8);
        
        for (let i = 0; i < squareCount; i++) {
          const square = document.createElement('div');
          square.className = `animated-square ${types[Math.floor(Math.random() * types.length)]}`;
          
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const size = Math.random() * 60 + 25;
          const rotation = Math.random() * 360;
          
          square.style.left = `${x}%`;
          square.style.top = `${y}%`;
          square.style.width = `${size}px`;
          square.style.height = `${size}px`;
          square.style.transform = `rotate(${rotation}deg)`;
          square.style.animationDelay = `${Math.random() * 6}s`;
          
          // Add different animation classes for variety
          if (Math.random() < 0.12) {
            square.classList.add('highlight');
          } else if (Math.random() < 0.08) {
            square.classList.add('magnetic');
          } else if (Math.random() < 0.06) {
            square.classList.add('cluster');
          }
          
          layer.appendChild(square);
        }
      });
    }

    const createParticles = () => {
      const particleContainer = document.getElementById('animated-particles');
      if (!particleContainer) return;
      
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'animated-particle';
        
        const x = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 4 + Math.random() * 4;
        
        particle.style.left = `${x}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        const colors = ['#ffffff', '#00ccff', '#0066ff', '#ff0099'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particleContainer.appendChild(particle);
      }
    };

    // Initialize animation after a short delay
    setTimeout(() => {
      createSquares();
      createParticles();
    }, 100);

    return () => {
      // Cleanup
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Digital Banner Background */}
      <div className="animated-banner-bg">
        <div className="digital-grid">
          <div className="grid-layer" id="layer1"></div>
          <div className="grid-layer" id="layer2"></div>
          <div className="grid-layer" id="layer3"></div>
        </div>
        
        <div className="animated-particles" id="animated-particles"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-poppins text-white mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">Thinkzo.ai</span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
            <span className="font-semibold text-white drop-shadow-lg">Your vision, our code — supercharged with AI.</span>
          </p>
          
          <p className="text-lg sm:text-xl text-cyan-400 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Smart tech, not sky-high prices.
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