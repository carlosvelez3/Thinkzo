/**
 * Performance Optimization Hook
 * Provides utilities for better performance
 */
import { useCallback, useMemo, useRef, useEffect } from 'react';

// Debounce hook for search inputs and API calls
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for scroll events and frequent updates
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [options]);

  return [targetRef, isIntersecting] as const;
};

// Memoized calculations for expensive operations
export const useMemoizedStats = (data: any[]) => {
  return useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        total: 0,
        average: 0,
        max: 0,
        min: 0
      };
    }

    const total = data.length;
    const numericData = data.filter(item => typeof item === 'number');
    
    if (numericData.length === 0) {
      return { total, average: 0, max: 0, min: 0 };
    }

    const sum = numericData.reduce((acc, val) => acc + val, 0);
    const average = sum / numericData.length;
    const max = Math.max(...numericData);
    const min = Math.min(...numericData);

    return { total, average, max, min };
  }, [data]);
};

// Optimized event handlers
export const useOptimizedHandlers = () => {
  const handleScroll = useThrottle((e: Event) => {
    // Throttled scroll handler
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
    
    // You can dispatch scroll events or update state here
    return scrollPercentage;
  }, 100);

  const handleResize = useThrottle(() => {
    // Throttled resize handler
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return { width, height };
  }, 250);

  return {
    handleScroll,
    handleResize
  };
};

// Browser compatibility checks
export const useBrowserSupport = () => {
  const support = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        intersectionObserver: false,
        webp: false,
        localStorage: false,
        serviceWorker: false
      };
    }

    return {
      intersectionObserver: 'IntersectionObserver' in window,
      webp: (() => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      })(),
      localStorage: (() => {
        try {
          const test = 'test';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch {
          return false;
        }
      })(),
      serviceWorker: 'serviceWorker' in navigator
    };
  }, []);

  return support;
};

// Performance monitoring
export const usePerformanceMonitor = () => {
  const measurePerformance = useCallback((name: string, fn: () => void | Promise<void>) => {
    const start = performance.now();
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
      });
    } else {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      return result;
    }
  }, []);

  return { measurePerformance };
};