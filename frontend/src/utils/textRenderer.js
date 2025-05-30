/**
 * Text Rendering Optimization Utilities
 * Handles Persian text rendering optimizations and performance improvements
 */

import { useEffect, useRef, useMemo } from 'react';

/**
 * Checks if a text contains Persian characters
 * @param {string} text - Text to check
 * @returns {boolean} - True if text contains Persian characters
 */
export const hasPersianText = (text) => {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
};

/**
 * Optimizes Persian text for rendering by applying proper character joining
 * @param {string} text - Persian text to optimize
 * @returns {string} - Optimized text
 */
export const optimizePersianText = (text) => {
  // Replace Arabic characters with Persian equivalents
  const persianized = text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/‌/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return persianized;
};

/**
 * Custom hook for optimized Persian text rendering
 * @param {string} text - Text to render
 * @param {object} options - Rendering options
 * @returns {object} - Optimized text and ref for the container
 */
export const useOptimizedTextRendering = (text, options = {}) => {
  const {
    enableVirtualization = true,
    chunkSize = 1000,
    debounceMs = 16
  } = options;

  const containerRef = useRef(null);
  const textChunksRef = useRef([]);
  const renderTimeoutRef = useRef(null);

  // Memoize text processing
  const optimizedText = useMemo(() => {
    if (!text || !hasPersianText(text)) return text;
    return optimizePersianText(text);
  }, [text]);

  // Split text into chunks for virtualization
  const textChunks = useMemo(() => {
    if (!enableVirtualization || !optimizedText) return [optimizedText];
    
    const chunks = [];
    for (let i = 0; i < optimizedText.length; i += chunkSize) {
      chunks.push(optimizedText.slice(i, i + chunkSize));
    }
    return chunks;
  }, [optimizedText, enableVirtualization, chunkSize]);

  useEffect(() => {
    if (!containerRef.current || !enableVirtualization) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const chunkIndex = parseInt(entry.target.dataset.chunkIndex, 10);
            if (!textChunksRef.current[chunkIndex]) {
              clearTimeout(renderTimeoutRef.current);
              renderTimeoutRef.current = setTimeout(() => {
                textChunksRef.current[chunkIndex] = textChunks[chunkIndex];
                entry.target.textContent = textChunks[chunkIndex];
              }, debounceMs);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    const chunkElements = containerRef.current.querySelectorAll('[data-chunk-index]');
    chunkElements.forEach(element => observer.observe(element));

    return () => {
      observer.disconnect();
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [textChunks, enableVirtualization, debounceMs]);

  return {
    optimizedText,
    containerRef,
    textChunks,
    isVirtualized: enableVirtualization && textChunks.length > 1
  };
};

/**
 * Component for rendering optimized Persian text
 * @param {object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
export const OptimizedText = ({ text, className = '', style = {}, options = {} }) => {
  const {
    optimizedText,
    containerRef,
    textChunks,
    isVirtualized
  } = useOptimizedTextRendering(text, options);

  if (!isVirtualized) {
    return (
      <span className={className} style={style}>
        {optimizedText}
      </span>
    );
  }

  return (
    <span ref={containerRef} className={className} style={style}>
      {textChunks.map((chunk, index) => (
        <span
          key={index}
          data-chunk-index={index}
          style={{ display: 'inline-block' }}
        >
          {textChunksRef.current[index] || ''}
        </span>
      ))}
    </span>
  );
}; 