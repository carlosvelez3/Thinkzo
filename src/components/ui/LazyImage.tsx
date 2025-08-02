/**
 * Lazy Loading Image Component
 * Optimized image loading with fallbacks
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/usePerformance';
import { Image as ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  placeholder,
  onLoad,
  onError
}) => {
  const [imageRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  React.useEffect(() => {
    if (isIntersecting && !currentSrc) {
      setCurrentSrc(src);
    }
  }, [isIntersecting, src, currentSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      onError?.();
    }
  };

  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-700/30 flex items-center justify-center">
          {placeholder || (
            <div className="flex flex-col items-center space-y-2">
              <ImageIcon className="text-slate-400" size={32} />
              <div className="text-slate-400 text-sm">Loading...</div>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-slate-700/30 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <ImageIcon className="text-slate-500" size={32} />
            <div className="text-slate-500 text-sm">Image unavailable</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {currentSrc && (
        <motion.img
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full object-cover ${isLoaded ? 'block' : 'hidden'}`}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;