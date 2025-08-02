/**
 * Accessibility Hook
 * Provides utilities for better accessibility support
 */
import { useEffect, useRef } from 'react';

export const useAccessibility = () => {
  // Focus management for modals
  const useFocusTrap = (isOpen: boolean) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isOpen || !containerRef.current) return;

      const container = containerRef.current;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          // This would need to be connected to a close function
          container.dispatchEvent(new CustomEvent('closeModal'));
        }
      };

      document.addEventListener('keydown', handleTabKey);
      document.addEventListener('keydown', handleEscapeKey);
      
      // Focus first element when modal opens
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTabKey);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }, [isOpen]);

    return containerRef;
  };

  // Announce changes to screen readers
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Generate unique IDs for form labels
  const useUniqueId = (prefix: string = 'id') => {
    const idRef = useRef<string>();
    
    if (!idRef.current) {
      idRef.current = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    return idRef.current;
  };

  return {
    useFocusTrap,
    announceToScreenReader,
    useUniqueId
  };
};

// Screen reader only styles
export const srOnlyStyles = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap' as const,
  border: '0'
};