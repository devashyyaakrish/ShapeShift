/**
 * Utility Helper Functions
 * Collection of helper functions for common operations
 */

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians) {
  return (radians * 180) / Math.PI;
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Distance between two 2D points
 */
export function distance2D(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Distance between two 3D points
 */
export function distance3D(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate centroid of polygon (2D)
 */
export function calculateCentroid2D(vertices) {
  if (vertices.length === 0) return [0, 0];

  let sumX = 0,
    sumY = 0;
  vertices.forEach((v) => {
    sumX += v[0];
    sumY += v[1];
  });

  return [sumX / vertices.length, sumY / vertices.length];
}

/**
 * Calculate centroid of polyhedron (3D)
 */
export function calculateCentroid3D(vertices) {
  if (vertices.length === 0) return [0, 0, 0];

  let sumX = 0,
    sumY = 0,
    sumZ = 0;
  vertices.forEach((v) => {
    sumX += v[0];
    sumY += v[1];
    sumZ += v[2];
  });

  return [sumX / vertices.length, sumY / vertices.length, sumZ / vertices.length];
}

/**
 * Calculate bounding box for 2D polygon
 */
export function calculateBoundingBox2D(vertices) {
  if (vertices.length === 0) return null;

  let minX = vertices[0][0],
    maxX = vertices[0][0];
  let minY = vertices[0][1],
    maxY = vertices[0][1];

  vertices.forEach((v) => {
    minX = Math.min(minX, v[0]);
    maxX = Math.max(maxX, v[0]);
    minY = Math.min(minY, v[1]);
    maxY = Math.max(maxY, v[1]);
  });

  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

/**
 * Calculate bounding box for 3D polyhedron
 */
export function calculateBoundingBox3D(vertices) {
  if (vertices.length === 0) return null;

  let minX = vertices[0][0],
    maxX = vertices[0][0];
  let minY = vertices[0][1],
    maxY = vertices[0][1];
  let minZ = vertices[0][2],
    maxZ = vertices[0][2];

  vertices.forEach((v) => {
    minX = Math.min(minX, v[0]);
    maxX = Math.max(maxX, v[0]);
    minY = Math.min(minY, v[1]);
    maxY = Math.max(maxY, v[1]);
    minZ = Math.min(minZ, v[2]);
    maxZ = Math.max(maxZ, v[2]);
  });

  return {
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    width: maxX - minX,
    height: maxY - minY,
    depth: maxZ - minZ,
  };
}

/**
 * Point in polygon test (2D)
 */
export function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Calculate area of 2D polygon
 */
export function calculateArea2D(vertices) {
  if (vertices.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    area += vertices[i][0] * vertices[j][1];
    area -= vertices[j][0] * vertices[i][1];
  }

  return Math.abs(area) / 2;
}

/**
 * Calculate perimeter of 2D polygon
 */
export function calculatePerimeter2D(vertices) {
  if (vertices.length < 2) return 0;

  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    perimeter += distance2D(vertices[i], vertices[j]);
  }

  return perimeter;
}

/**
 * Normalize vector
 */
export function normalizeVector(vector) {
  const length = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (length === 0) return vector;
  return vector.map((val) => val / length);
}

/**
 * Dot product
 */
export function dotProduct(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Cross product (3D)
 */
export function crossProduct(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

/**
 * Generate regular polygon
 */
export function generateRegularPolygon(sides, radius, centerX = 0, centerY = 0) {
  const vertices = [];
  const angleStep = (2 * Math.PI) / sides;

  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep;
    vertices.push([centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle)]);
  }

  return vertices;
}

/**
 * Generate circle vertices
 */
export function generateCircleVertices(radius, segments = 32, centerX = 0, centerY = 0) {
  const vertices = [];
  const angleStep = (2 * Math.PI) / segments;

  for (let i = 0; i < segments; i++) {
    const angle = i * angleStep;
    vertices.push([centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle)]);
  }

  return vertices;
}

/**
 * Generate grid
 */
export function generateGrid(width, height, stepX, stepY, offsetX = 0, offsetY = 0) {
  const lines = [];

  // Vertical lines
  for (let x = offsetX; x <= offsetX + width; x += stepX) {
    lines.push([
      [x, offsetY],
      [x, offsetY + height],
    ]);
  }

  // Horizontal lines
  for (let y = offsetY; y <= offsetY + height; y += stepY) {
    lines.push([
      [offsetX, y],
      [offsetX + width, y],
    ]);
  }

  return lines;
}

/**
 * Format number to fixed decimal places
 */
export function formatNumber(value, decimals = 2) {
  return parseFloat(value.toFixed(decimals));
}

/**
 * Deep copy object
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Throttle function
 */
export function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  };
}

/**
 * Debounce function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Request animation frame utility
 */
export function createAnimationLoop(callback) {
  let isRunning = true;
  let frameId;

  function loop() {
    if (isRunning) {
      callback();
      frameId = requestAnimationFrame(loop);
    }
  }

  return {
    start: () => {
      isRunning = true;
      loop();
    },
    stop: () => {
      isRunning = false;
      cancelAnimationFrame(frameId);
    },
    isRunning: () => isRunning,
  };
}

export default {
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
};
