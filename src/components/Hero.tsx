import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/global-network-connection-stockcake.jpg"
      >
        <source src="/path-to-your-video.mp4" type="video/mp4" />
        <source src="/path-to-your-video.webm" type="video/webm" />
        {/* Fallback image if video fails to load */}
        <img 
          src="/global-network-connection-stockcake.jpg" 
          alt="Global Network Connection" 
          className="w-full h-full object-cover"
        />
      </video>
      
      {/* Sophisticated overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-navy-950/40 to-navy-950/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/50 via-transparent to-navy-950/50" />
      
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