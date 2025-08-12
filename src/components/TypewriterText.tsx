import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // milliseconds between characters
  delay?: number; // delay before starting animation
  className?: string;
  trigger?: 'immediate' | 'scroll'; // when to start animation
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  trigger = 'scroll',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Set up Intersection Observer for scroll-triggered animation
  useEffect(() => {
    if (trigger === 'immediate') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before element is fully visible
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [trigger, hasStarted]);

  // Typewriter animation effect
  useEffect(() => {
    if (!isVisible || hasStarted) return;

    setHasStarted(true);
    
    const startAnimation = () => {
      let currentIndex = 0;
      
      const typeNextCharacter = () => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
          
          if (currentIndex <= text.length) {
            setTimeout(typeNextCharacter, speed);
          } else if (onComplete) {
            onComplete();
          }
        }
      };

      typeNextCharacter();
    };

    if (delay > 0) {
      setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
  }, [isVisible, text, speed, delay, hasStarted, onComplete]);

  return (
    <span ref={elementRef} className={className}>
      {displayedText}
      {hasStarted && displayedText.length < text.length && (
        <span className="animate-pulse text-cyan-400">|</span>
      )}
    </span>
  );
};

export default TypewriterText;