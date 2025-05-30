/**
 * Text Layout Caching Utilities
 * Handles caching and optimization of text layout calculations for Persian text
 */

import { useEffect, useRef, useMemo } from 'react';
import { measureText, estimateTextWidth } from './textMeasurement';

// LRU Cache for layout calculations
class LayoutCache {
  constructor(maxSize = 500) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    const value = this.cache.get(key);
    if (value) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

// Global layout cache instance
const layoutCache = new LayoutCache();

/**
 * Generates a cache key for layout calculations
 * @param {string} text - Text content
 * @param {number} width - Container width
 * @param {object} options - Layout options
 * @returns {string} - Cache key
 */
const getLayoutCacheKey = (text, width, options) => {
  const optionsKey = JSON.stringify(options);
  return `${text}::${width}::${optionsKey}`;
};

/**
 * Calculates text layout with line breaks and justification
 * @param {string} text - Text to layout
 * @param {number} containerWidth - Available width
 * @param {object} options - Layout options
 * @returns {object} - Layout information
 */
export const calculateTextLayout = (text, containerWidth, options = {}) => {
  const {
    fontSize = 14,
    fontFamily = 'Vazirmatn',
    lineHeight = 1.5,
    textAlign = 'right',
    justify = true
  } = options;

  const cacheKey = getLayoutCacheKey(text, containerWidth, options);
  const cached = layoutCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = [];
  let currentWidth = 0;

  // Calculate line breaks
  for (const word of words) {
    const wordWidth = measureText(word, { fontSize, fontFamily }).width;
    const spaceWidth = measureText(' ', { fontSize, fontFamily }).width;

    if (currentWidth + wordWidth + (currentLine.length > 0 ? spaceWidth : 0) <= containerWidth) {
      currentLine.push(word);
      currentWidth += wordWidth + (currentLine.length > 1 ? spaceWidth : 0);
    } else {
      if (currentLine.length > 0) {
        lines.push({
          words: currentLine,
          width: currentWidth,
          spaceWidth
        });
      }
      currentLine = [word];
      currentWidth = wordWidth;
    }
  }

  if (currentLine.length > 0) {
    lines.push({
      words: currentLine,
      width: currentWidth,
      spaceWidth: measureText(' ', { fontSize, fontFamily }).width
    });
  }

  // Calculate justification
  const layout = lines.map((line, index) => {
    const isLastLine = index === lines.length - 1;
    const shouldJustify = justify && !isLastLine && line.words.length > 1;

    if (shouldJustify) {
      const totalSpacing = containerWidth - line.width;
      const spacesCount = line.words.length - 1;
      const extraSpacePerGap = totalSpacing / spacesCount;

      return {
        words: line.words,
        positions: line.words.map((_, wordIndex) => {
          const previousWordsWidth = line.words
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + measureText(word, { fontSize, fontFamily }).width, 0);
          const extraSpace = wordIndex * extraSpacePerGap;
          return previousWordsWidth + extraSpace;
        }),
        justified: true,
        width: containerWidth
      };
    }

    // For non-justified lines
    let lineStart = 0;
    if (textAlign === 'right') {
      lineStart = containerWidth - line.width;
    } else if (textAlign === 'center') {
      lineStart = (containerWidth - line.width) / 2;
    }

    return {
      words: line.words,
      positions: line.words.map((_, wordIndex) => {
        const previousWordsWidth = line.words
          .slice(0, wordIndex)
          .reduce((sum, word) => sum + measureText(word, { fontSize, fontFamily }).width + line.spaceWidth, 0);
        return lineStart + previousWordsWidth;
      }),
      justified: false,
      width: line.width
    };
  });

  const result = {
    lines: layout,
    height: lines.length * (fontSize * lineHeight),
    width: containerWidth
  };

  layoutCache.set(cacheKey, result);
  return result;
};

/**
 * Custom hook for text layout with caching
 * @param {string} text - Text to layout
 * @param {number} width - Container width
 * @param {object} options - Layout options
 * @returns {object} - Layout information and utilities
 */
export const useTextLayout = (text, width, options = {}) => {
  const prevLayout = useRef(null);

  const layout = useMemo(() => {
    if (!text || !width) return null;
    return calculateTextLayout(text, width, options);
  }, [text, width, JSON.stringify(options)]);

  useEffect(() => {
    prevLayout.current = layout;
  }, [layout]);

  return {
    layout,
    previousLayout: prevLayout.current,
    clearCache: () => layoutCache.clear()
  };
};

/**
 * Component for rendering text with cached layout
 * @param {object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
export const LayoutOptimizedText = ({
  text,
  width,
  className = '',
  style = {},
  options = {}
}) => {
  const { layout } = useTextLayout(text, width, options);

  if (!layout) {
    return null;
  }

  const {
    fontSize = 14,
    lineHeight = 1.5,
    fontFamily = 'Vazirmatn'
  } = options;

  return (
    <div
      className={className}
      style={{
        ...style,
        width,
        height: layout.height,
        position: 'relative',
        direction: 'rtl'
      }}
    >
      {layout.lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          style={{
            position: 'absolute',
            top: lineIndex * (fontSize * lineHeight),
            width: '100%',
            height: fontSize * lineHeight,
            direction: 'rtl'
          }}
        >
          {line.words.map((word, wordIndex) => (
            <span
              key={wordIndex}
              style={{
                position: 'absolute',
                right: width - line.positions[wordIndex] - measureText(word, { fontSize, fontFamily }).width,
                fontFamily,
                fontSize: `${fontSize}px`,
                whiteSpace: 'pre'
              }}
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}; 