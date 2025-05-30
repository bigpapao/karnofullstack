/**
 * Text Performance Monitoring Utilities
 * Monitors and analyzes Persian text rendering performance
 */

import { useEffect, useRef, useState } from 'react';

// Performance metrics storage
class PerformanceMetrics {
  constructor() {
    this.metrics = new Map();
    this.thresholds = {
      layout: 16, // ms (1 frame at 60fps)
      render: 8, // ms (half a frame)
      measure: 4, // ms (quarter of a frame)
    };
  }

  record(category, operation, duration) {
    const key = `${category}:${operation}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        count: 0,
        totalDuration: 0,
        min: Infinity,
        max: -Infinity,
        samples: []
      });
    }

    const metric = this.metrics.get(key);
    metric.count++;
    metric.totalDuration += duration;
    metric.min = Math.min(metric.min, duration);
    metric.max = Math.max(metric.max, duration);
    metric.samples.push({
      timestamp: Date.now(),
      duration
    });

    // Keep only last 100 samples
    if (metric.samples.length > 100) {
      metric.samples.shift();
    }
  }

  getMetrics(category, operation) {
    const key = `${category}:${operation}`;
    const metric = this.metrics.get(key);
    if (!metric) return null;

    const average = metric.totalDuration / metric.count;
    const recent = metric.samples.slice(-10);
    const recentAverage = recent.reduce((sum, s) => sum + s.duration, 0) / recent.length;

    return {
      count: metric.count,
      average,
      min: metric.min,
      max: metric.max,
      recentAverage,
      exceedsThreshold: average > (this.thresholds[category] || 16)
    };
  }

  clear() {
    this.metrics.clear();
  }
}

// Global performance metrics instance
const performanceMetrics = new PerformanceMetrics();

/**
 * Measures the execution time of a function
 * @param {Function} fn - Function to measure
 * @param {string} category - Metric category
 * @param {string} operation - Operation name
 * @returns {*} - Function result
 */
export const measurePerformance = (fn, category, operation) => {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  performanceMetrics.record(category, operation, duration);
  return result;
};

/**
 * Custom hook for monitoring text rendering performance
 * @param {string} componentId - Unique identifier for the component
 * @returns {object} - Performance monitoring utilities
 */
export const useTextPerformanceMonitor = (componentId) => {
  const renderCount = useRef(0);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    renderCount.current++;
    
    return () => {
      // Record final metrics on unmount
      performanceMetrics.record('render', componentId, performance.now());
    };
  }, [componentId]);

  const measure = (operation, fn) => {
    return measurePerformance(fn, componentId, operation);
  };

  const getMetrics = () => {
    const layoutMetrics = performanceMetrics.getMetrics('layout', componentId);
    const renderMetrics = performanceMetrics.getMetrics('render', componentId);
    const measureMetrics = performanceMetrics.getMetrics('measure', componentId);

    setMetrics({
      layout: layoutMetrics,
      render: renderMetrics,
      measure: measureMetrics,
      renderCount: renderCount.current
    });

    return {
      layout: layoutMetrics,
      render: renderMetrics,
      measure: measureMetrics,
      renderCount: renderCount.current
    };
  };

  return {
    measure,
    getMetrics,
    metrics
  };
};

/**
 * Higher-order component for performance monitoring
 * @param {React.ComponentType} WrappedComponent - Component to monitor
 * @param {string} componentId - Unique identifier
 * @returns {React.ComponentType} - Monitored component
 */
export const withPerformanceMonitoring = (WrappedComponent, componentId) => {
  return function MonitoredComponent(props) {
    const { measure, getMetrics, metrics } = useTextPerformanceMonitor(componentId);

    useEffect(() => {
      // Report metrics periodically
      const interval = setInterval(() => {
        const currentMetrics = getMetrics();
        if (currentMetrics.layout?.exceedsThreshold ||
            currentMetrics.render?.exceedsThreshold ||
            currentMetrics.measure?.exceedsThreshold) {
          console.warn(`Performance warning for ${componentId}:`, currentMetrics);
        }
      }, 5000);

      return () => clearInterval(interval);
    }, []);

    const monitoredProps = {
      ...props,
      measure,
      performanceMetrics: metrics
    };

    return <WrappedComponent {...monitoredProps} />;
  };
};

/**
 * Component for displaying performance metrics
 * @param {object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
export const PerformanceDisplay = ({ metrics, className = '', style = {} }) => {
  if (!metrics) return null;

  return (
    <div
      className={`performance-metrics ${className}`}
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: 12,
        borderRadius: 4,
        fontSize: 12,
        fontFamily: 'monospace',
        zIndex: 9999,
        ...style
      }}
    >
      <div>Render Count: {metrics.renderCount}</div>
      {metrics.layout && (
        <div style={{ color: metrics.layout.exceedsThreshold ? '#ff6b6b' : '#69db7c' }}>
          Layout: {metrics.layout.recentAverage.toFixed(2)}ms
        </div>
      )}
      {metrics.render && (
        <div style={{ color: metrics.render.exceedsThreshold ? '#ff6b6b' : '#69db7c' }}>
          Render: {metrics.render.recentAverage.toFixed(2)}ms
        </div>
      )}
      {metrics.measure && (
        <div style={{ color: metrics.measure.exceedsThreshold ? '#ff6b6b' : '#69db7c' }}>
          Measure: {metrics.measure.recentAverage.toFixed(2)}ms
        </div>
      )}
    </div>
  );
}; 