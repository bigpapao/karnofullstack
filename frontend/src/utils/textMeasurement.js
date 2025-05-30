/**
 * Text Measurement Caching Utilities
 * Handles caching and optimization of text measurements for Persian text
 */

// LRU Cache implementation for text measurements
class LRUCache {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    
    // Move accessed item to the end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove the first item (least recently used)
      this.cache.delete(this.cache.keys().next().value);
    }
    
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

// Global measurement cache
const measurementCache = new LRUCache(1000);

// Canvas for text measurements
let measurementCanvas;

/**
 * Gets or creates a canvas for text measurements
 * @returns {HTMLCanvasElement} - Canvas element for measurements
 */
const getMeasurementCanvas = () => {
  if (!measurementCanvas) {
    measurementCanvas = document.createElement('canvas');
  }
  return measurementCanvas;
};

/**
 * Generates a cache key for text measurements
 * @param {string} text - Text to measure
 * @param {string} font - Font string (e.g., '14px Vazirmatn')
 * @returns {string} - Cache key
 */
const getCacheKey = (text, font) => `${text}::${font}`;

/**
 * Measures text dimensions with caching
 * @param {string} text - Text to measure
 * @param {object} options - Measurement options
 * @returns {object} - Text dimensions { width, height }
 */
export const measureText = (text, options = {}) => {
  const {
    fontSize = 14,
    fontFamily = 'Vazirmatn',
    fontWeight = 'normal',
    fontStyle = 'normal'
  } = options;

  const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  const cacheKey = getCacheKey(text, font);

  // Check cache first
  const cachedMeasurement = measurementCache.get(cacheKey);
  if (cachedMeasurement) {
    return cachedMeasurement;
  }

  // Perform measurement
  const canvas = getMeasurementCanvas();
  const context = canvas.getContext('2d');
  context.font = font;

  const metrics = context.measureText(text);
  const measurement = {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  };

  // Cache the result
  measurementCache.set(cacheKey, measurement);

  return measurement;
};

/**
 * Custom hook for measuring text with caching
 * @param {string} text - Text to measure
 * @param {object} options - Measurement options
 * @returns {object} - Text dimensions and measurement utilities
 */
export const useTextMeasurement = (text, options = {}) => {
  const measurement = useMemo(() => {
    if (!text) return { width: 0, height: 0 };
    return measureText(text, options);
  }, [text, JSON.stringify(options)]);

  return {
    ...measurement,
    measureText: (newText, newOptions = options) => measureText(newText, newOptions),
    clearCache: () => measurementCache.clear()
  };
};

/**
 * Precomputes text measurements for a set of strings
 * @param {string[]} texts - Array of texts to measure
 * @param {object} options - Measurement options
 */
export const precomputeMeasurements = (texts, options = {}) => {
  texts.forEach(text => {
    if (!measurementCache.get(getCacheKey(text, options))) {
      measureText(text, options);
    }
  });
};

/**
 * Estimates text width without actual measurement
 * Uses average character width for quick approximation
 * @param {string} text - Text to estimate
 * @param {object} options - Measurement options
 * @returns {number} - Estimated width in pixels
 */
export const estimateTextWidth = (text, options = {}) => {
  const { fontSize = 14 } = options;
  
  // Average character width in ems for Persian text
  const persianCharWidthEm = 0.6;
  
  // Convert em to pixels based on font size
  const charWidthPx = persianCharWidthEm * fontSize;
  
  return text.length * charWidthPx;
};

/**
 * Component for measuring and caching text dimensions
 * @param {object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
export const MeasuredText = ({ text, className = '', style = {}, onMeasure, children }) => {
  const measurement = useTextMeasurement(text);

  useEffect(() => {
    if (onMeasure) {
      onMeasure(measurement);
    }
  }, [measurement, onMeasure]);

  return children ? (
    children(measurement)
  ) : (
    <span
      className={className}
      style={{
        ...style,
        display: 'inline-block',
        width: measurement.width,
        height: measurement.height
      }}
    >
      {text}
    </span>
  );
}; 