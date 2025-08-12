import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import TypewriterText from './TypewriterText';

const Hero: React.FC = () => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Create and inject the IOTA-style synchronized squares animation
    const style = document.createElement('style');
    style.textContent = `
      .iota-banner-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0b1220 0%, #111833 50%, #0b1220 100%);
        overflow: hidden;
      }

      .iota-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: repeat(8, 1fr);
        gap: 2px;
        padding: 20px;
      }

      .iota-square {
        position: relative;
        width: 100%;
        height: 100%;
        background: rgba(91, 140, 255, 0.08);
        border: 1px solid rgba(91, 140, 255, 0.15);
        border-radius: 8px;
        backdrop-filter: blur(1px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: iotaWave 8s ease-in-out infinite;
      }

      .iota-square::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(91, 140, 255, 0.1), transparent);
        border-radius: 8px;
        opacity: 0;
        transition: opacity 0.6s ease;
      }

      .iota-square.active::before {
        opacity: 1;
      }

      .iota-square.active {
        background: rgba(91, 140, 255, 0.15);
        border-color: rgba(91, 140, 255, 0.3);
        box-shadow: 0 0 15px rgba(91, 140, 255, 0.2);
        transform: scale(1.05);
      }

      .iota-square.pulse {
        animation: iotaPulse 2s ease-in-out infinite;
      }

      .iota-ambient-glow {
        position: absolute;
        top: 20%;
        left: 20%;
        width: 60%;
        height: 60%;
        background: radial-gradient(circle, rgba(91, 140, 255, 0.03) 0%, transparent 70%);
        border-radius: 50%;
        animation: ambientGlow 12s ease-in-out infinite;
      }

      /* Synchronized wave animation */
      @keyframes iotaWave {
        0%, 100% { 
          transform: scale(1) translateY(0);
          opacity: 0.6;
        }
        25% { 
          transform: scale(1.02) translateY(-2px);
          opacity: 0.8;
        }
        50% { 
          transform: scale(1.05) translateY(-4px);
          opacity: 1;
        }
        75% { 
          transform: scale(1.02) translateY(-2px);
          opacity: 0.8;
        }
      }

      @keyframes iotaPulse {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 0 15px rgba(91, 140, 255, 0.2);
        }
        50% { 
          transform: scale(1.08);
          box-shadow: 0 0 25px rgba(91, 140, 255, 0.4);
        }
      }

      @keyframes ambientGlow {
        0%, 100% { 
          opacity: 0.3;
          transform: scale(1);
        }
        50% { 
          opacity: 0.6;
          transform: scale(1.1);
        }
      }

      /* Responsive grid adjustments */
      @media (max-width: 768px) {
        .iota-grid {
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(12, 1fr);
          padding: 15px;
        }
      }

      @media (max-width: 480px) {
        .iota-grid {
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: repeat(16, 1fr);
          padding: 10px;
        }
      }

      /* Center safe area - keep clean for content */
      .iota-square:nth-child(n+25):nth-child(-n+72) {
        opacity: 0.3;
        animation-duration: 12s;
      }

      /* Special moving blocks animation */
      .iota-square.dynamic-action {
        position: relative;
        z-index: 5;
        animation: iotaWave 8s ease-in-out infinite, dynamic-block-action 3s ease-in-out forwards;
      }

      @keyframes dynamic-block-action {
        0%, 100% { 
          transform: scale(1) translateX(0) translateY(0);
          background: rgba(0, 100, 255, 0.1);
          border-color: rgba(91, 140, 255, 0.15);
          box-shadow: 0 0 15px rgba(91, 140, 255, 0.2);
        }
        25% { 
          transform: scale(1.3) translateX(15px) translateY(-10px);
          background: rgba(34, 211, 238, 0.3);
          border-color: rgba(34, 211, 238, 0.6);
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.6), 0 0 60px rgba(34, 211, 238, 0.3);
        }
        50% { 
          transform: scale(1.5) translateX(25px) translateY(-20px);
          background: rgba(168, 85, 247, 0.4);
          border-color: rgba(168, 85, 247, 0.7);
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.7), 0 0 80px rgba(168, 85, 247, 0.4);
        }
        75% { 
          transform: scale(1.2) translateX(10px) translateY(-5px);
          background: rgba(236, 72, 153, 0.3);
          border-color: rgba(236, 72, 153, 0.6);
          box-shadow: 0 0 35px rgba(236, 72, 153, 0.6), 0 0 70px rgba(236, 72, 153, 0.3);
        }
      }

      /* Responsive adjustments for special blocks */
      @media (max-width: 768px) {
        @keyframes dynamic-block-action {
          0%, 100% { 
            transform: scale(1) translateX(0) translateY(0);
            background: rgba(0, 100, 255, 0.1);
            border-color: rgba(91, 140, 255, 0.15);
            box-shadow: 0 0 15px rgba(91, 140, 255, 0.2);
          }
          25% { 
            transform: scale(1.2) translateX(8px) translateY(-5px);
            background: rgba(34, 211, 238, 0.3);
            border-color: rgba(34, 211, 238, 0.6);
            box-shadow: 0 0 25px rgba(34, 211, 238, 0.6);
          }
          50% { 
            transform: scale(1.3) translateX(12px) translateY(-8px);
            background: rgba(168, 85, 247, 0.4);
            border-color: rgba(168, 85, 247, 0.7);
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.7);
          }
          75% { 
            transform: scale(1.1) translateX(5px) translateY(-3px);
            background: rgba(236, 72, 153, 0.3);
            border-color: rgba(236, 72, 153, 0.6);
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
          }
        }
      }
    `;
    document.head.appendChild(style);

    // Create IOTA-style synchronized grid
    const createIotaGrid = () => {
      const grid = document.getElementById('iota-grid');
      if (!grid) return;

      // Clear existing squares
      grid.innerHTML = '';

      // Calculate grid size based on screen size
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      
      let cols, rows;
      if (isSmallMobile) {
        cols = 6; rows = 16;
      } else if (isMobile) {
        cols = 8; rows = 12;
      } else {
        cols = 12; rows = 8;
      }

      const totalSquares = cols * rows;

      // Create squares
      for (let i = 0; i < totalSquares; i++) {
        const square = document.createElement('div');
        square.className = 'iota-square';
        
        // Calculate position in grid
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        // Create diagonal wave effect with staggered delays
        const diagonalIndex = row + col;
        const delay = (diagonalIndex * 0.1) % 8; // 8-second cycle
        
        square.style.animationDelay = `${delay}s`;
        
        // Add special effects to some squares
        if (Math.random() < 0.15) {
          square.classList.add('pulse');
          square.style.animationDelay = `${delay + Math.random() * 2}s`;
        }
        
        // Create special moving blocks (6-8 blocks)
        // All squares start as regular squares - special actions will be applied dynamically
        
        grid.appendChild(square);
      }
    };

    // Synchronized wave activation
    const activateWaves = () => {
      const squares = document.querySelectorAll('.iota-square');
      
      setInterval(() => {
        // First, activate the regular diagonal wave pattern
        // Create diagonal wave pattern
        squares.forEach((square, index) => {
          const cols = window.innerWidth <= 480 ? 6 : window.innerWidth <= 768 ? 8 : 12;
          const row = Math.floor(index / cols);
          const col = index % cols;
          const diagonalIndex = row + col;
          
          setTimeout(() => {
            square.classList.add('active');
            setTimeout(() => {
              square.classList.remove('active');
            }, 1000);
          }, diagonalIndex * 100);
        });
        
        // Then, randomly select 6-8 blocks for special dynamic action
        const squareArray = Array.from(squares);
        const shuffledSquares = squareArray.sort(() => Math.random() - 0.5);
        const numSpecialBlocks = Math.floor(Math.random() * 3) + 6; // Random number between 6-8
        const selectedSquares = shuffledSquares.slice(0, numSpecialBlocks);
        
        selectedSquares.forEach((square, index) => {
          // Remove any existing dynamic-action class
          square.classList.remove('dynamic-action');
          
          // Add dynamic-action class with staggered timing
          setTimeout(() => {
            square.classList.add('dynamic-action');
            
            // Remove the class after animation completes (3 seconds)
            setTimeout(() => {
              square.classList.remove('dynamic-action');
            }, 3000);
          }, index * 400); // Stagger the start times by 400ms
        });
      }, 8000); // 8-second cycle
    };

    // Initialize IOTA animation
    setTimeout(() => {
      createIotaGrid();
      activateWaves();
    }, 100);

    // Handle window resize
    const handleResize = () => {
      createIotaGrid();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* IOTA-style Synchronized Squares Background */}
      <div className="iota-banner-bg">
        <div className="iota-ambient-glow"></div>
        <div className="iota-grid" id="iota-grid">
          {/* Squares will be generated dynamically */}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-poppins text-white mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              <TypewriterText 
                text="Thinkzo.ai" 
                speed={150}
                trigger="immediate"
              />
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
            <span className="font-semibold text-white drop-shadow-lg">
              <TypewriterText 
                text="Your vision, our code — supercharged with AI."
                speed={60}
                delay={1500}
              />
            </span>
          </p>
          
          <p className="text-lg sm:text-xl text-cyan-400 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            <TypewriterText 
              text="Smart tech, not sky-high prices."
              speed={80}
              delay={3500}
            />
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