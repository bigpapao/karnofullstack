/**
 * React Router Configuration
 * 
 * This file sets up configuration for React Router, including future flags
 * that help prepare for React Router v7.
 */

// These future flags are required to address warnings about transition and relative paths
export const routerFutureConfig = {
  v7_startTransition: true,   // Opt in to React 18 startTransition for state updates
  v7_relativeSplatPath: true  // Opt in to relative splat path behavior
};

/**
 * Helper function to create router with proper configuration
 * Use this function when creating your router instance to ensure consistent configuration.
 * 
 * Example usage:
 * ```
 * import { createBrowserRouter } from 'react-router-dom';
 * import { configureRouter } from './routerConfig';
 * 
 * const router = configureRouter(createBrowserRouter, routes);
 * ```
 */
export const configureRouter = (routerFunction, routes, options = {}) => {
  return routerFunction(routes, {
    future: routerFutureConfig, 
    // Allow passing additional options that are merged with the future flags
    ...options
  });
};

export default routerFutureConfig; 