/**
 * TransformX Core - Entry Point & Index
 * 
 * This file provides a convenient entry point for importing all
 * TransformX Core modules and features.
 * 
 * Usage:
 * ------
 * import TransformX from './index.js';
 * 
 * const app = new TransformX.API();
 * app.init('2D').translate2D(100, 50);
 */

// Main Public API
export { default as TransformXAPI } from "./src/core/TransformXAPI.js";

// Core Engine
export { default as TransformXCore } from "./src/core/TransformXCore.js";

// Transformation Engines
export { default as Transform2D } from "./src/2d/Transform2D.js";
export { default as Transform3D } from "./src/3d/Transform3D.js";

// Animation & History
export {
  AnimationManager,
  TransitionManager,
} from "./src/core/AnimationManager.js";
export {
  HistoryManager,
  TransformationPipeline,
  TransformationBatch,
} from "./src/core/HistoryManager.js";

// Matrix Utilities
export {
  multiplyMatrices,
  applyTransformation,
  identityMatrix,
  generate2DTranslationMatrix,
  generate2DRotationMatrix,
  generate2DScalingMatrix,
  generate2DReflectionMatrix,
  generate2DReflectionLineMatrix,
  generate2DShearingMatrix,
  generate3DTranslationMatrix,
  generate3DRotationMatrixX,
  generate3DRotationMatrixY,
  generate3DRotationMatrixZ,
  generate3DScalingMatrix,
  formatMatrix,
  copyMatrix,
  homogenousTo2D,
  homogenousTo3D,
} from "./src/utils/matrix.js";

// Helper Utilities
export {
  degreesToRadians,
  radiansToDegrees,
  clamp,
  lerp,
  distance2D,
  distance3D,
  calculateCentroid2D,
  calculateCentroid3D,
  calculateBoundingBox2D,
  calculateBoundingBox3D,
  pointInPolygon,
  calculateArea2D,
  calculatePerimeter2D,
  normalizeVector,
  dotProduct,
  crossProduct,
  generateRegularPolygon,
  generateCircleVertices,
  generateGrid,
  formatNumber,
  deepCopy,
  throttle,
  debounce,
  createAnimationLoop,
} from "./src/utils/helpers.js";

// Configuration
export {
  CONFIG,
  TRANSFORMATION_PRESETS,
  ANIMATION_PRESETS,
  SHORTCUTS,
  ERRORS,
  SUCCESS_MESSAGES,
  DEFAULT_SHAPES,
  EASING_FUNCTIONS,
} from "./src/core/config.js";

/**
 * Default export - TransformXAPI (Main API)
 * 
 * For convenience, the main API is exported as default:
 * 
 * import TransformX from './index.js';
 * const api = new TransformX();
 */
import TransformXAPI from "./src/core/TransformXAPI.js";
export default TransformXAPI;

/**
 * Quick Start Example
 * 
 * import TransformX from './index.js';
 * 
 * const api = new TransformX();
 * api
 *   .init('2D')
 *   .translate2D(100, 50)
 *   .rotate2D(45)
 *   .scale2D(1.5)
 *   .onStateChange((state) => {
 *     console.log('Transformation applied:', state);
 *   });
 * 
 * // Get results
 * const vertices = api.getVertices();
 * const matrix = api.getMatrix();
 * const history = api.getHistory();
 * 
 * // Undo/Redo
 * api.undo();
 * api.redo();
 * 
 * // Export state
 * const json = api.exportState();
 * localStorage.setItem('app-state', json);
 */
