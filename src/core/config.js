/**
 * Configuration and Constants
 * Application-wide settings and constants
 */

export const CONFIG = {
  // Application settings
  APP_NAME: "TransformX: Interactive 2D & 3D Transformation Visualizer",
  VERSION: "1.0.0",
  DEBUG_MODE: false,

  // 2D Canvas settings
  CANVAS_2D: {
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    BACKGROUND_COLOR: "#ffffff",
    GRID_COLOR: "#e0e0e0",
    GRID_SIZE: 50,
    GRID_ENABLED: true,
  },

  // 2D Rendering colors
  COLORS_2D: {
    ORIGINAL_SHAPE: "#3498db",
    TRANSFORMED_SHAPE: "#e74c3c",
    VERTEX: "#2c3e50",
    VERTEX_RADIUS: 5,
    GRID: "#ecf0f1",
    AXIS: "#95a5a6",
    MATRIX_BACKGROUND: "#f8f9fa",
  },

  // 3D Rendering settings
  CANVAS_3D: {
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    FOV: 75,
    NEAR_CLIP: 0.1,
    FAR_CLIP: 1000,
    WIREFRAME: false,
    SHOW_AXES: true,
    SHOW_GRID: true,
    BACKGROUND_COLOR: 0xffffff,
  },

  // 3D Colors
  COLORS_3D: {
    WIREFRAME: 0x000000,
    FACE_DEFAULT: 0x3498db,
    FACE_HIGHLIGHT: 0xe74c3c,
    AXES: {
      X: 0xff0000,
      Y: 0x00ff00,
      Z: 0x0000ff,
    },
    GRID: 0xcccccc,
  },

  // Transformation constraints
  TRANSFORM_LIMITS: {
    SCALE_MIN: 0.1,
    SCALE_MAX: 10,
    ROTATION_SPEED: 2, // degrees per frame
    TRANSLATION_SPEED: 5, // units per frame
  },

  // Animation settings
  ANIMATION: {
    DEFAULT_DURATION: 3000, // milliseconds
    FPS: 60,
    FRAME_DURATION: 16.67, // 1000/60
  },

  // History settings
  HISTORY: {
    MAX_UNDO_STEPS: 50,
    STORAGE_KEY: "transformx_history",
  },

  // Matrix display settings
  MATRIX: {
    PRECISION: 2,
    ELEMENT_SIZE: 40,
    FONT_SIZE: 12,
    FONT_FAMILY: "monospace",
    BORDER_COLOR: "#333",
    BACKGROUND_COLOR: "#f5f5f5",
  },

  // UI Settings
  UI: {
    SIDEBAR_WIDTH: 300,
    PANEL_PADDING: 10,
    BUTTON_RADIUS: 4,
    INPUT_HEIGHT: 32,
    SLIDER_HEIGHT: 6,
  },

  // Export settings
  EXPORT: {
    IMAGE_FORMAT: "png",
    IMAGE_QUALITY: 0.95,
    IMAGE_WIDTH: 1920,
    IMAGE_HEIGHT: 1440,
  },
};

/**
 * Transformation presets
 */
export const TRANSFORMATION_PRESETS = {
  "2D": {
    translate: { tx: 100, ty: 50 },
    rotate: { angle: 45, pivot: [0, 0] },
    scale: { sx: 1.5, sy: 1.5, pivot: [0, 0] },
    reflect: { axis: "x" },
    shear: { shx: 0.3, shy: 0 },
  },
  "3D": {
    translate: { tx: 50, ty: 0, tz: 50 },
    rotateX: { angle: 45 },
    rotateY: { angle: 45 },
    rotateZ: { angle: 45 },
    scale: { sx: 1.2, sy: 1.2, sz: 1.2 },
  },
};

/**
 * Animation presets
 */
export const ANIMATION_PRESETS = {
  "2D": {
    rotate: { angle: 360, duration: 4000 },
    scale: { sx: 2, sy: 2, duration: 3000 },
    translate: { tx: 200, ty: 200, duration: 3000 },
  },
  "3D": {
    rotateEuler: { angleX: 360, angleY: 360, angleZ: 360, duration: 5000 },
    scale: { sx: 1.5, sy: 1.5, sz: 1.5, duration: 3000 },
    translate: { tx: 100, ty: 100, tz: 100, duration: 3000 },
  },
};

/**
 * Keyboard shortcuts
 */
export const SHORTCUTS = {
  UNDO: "Ctrl+Z",
  REDO: "Ctrl+Y",
  RESET: "Ctrl+R",
  EXPORT: "Ctrl+S",
  TOGGLE_MODE: "Ctrl+T",
  PLAY_ANIMATION: "Space",
};

/**
 * Error messages
 */
export const ERRORS = {
  INVALID_MODE: "Invalid mode. Use '2D' or '3D'.",
  INVALID_MATRIX: "Invalid matrix dimensions.",
  INVALID_VERTICES: "Invalid vertex data.",
  ANIMATION_NOT_RUNNING: "No animation is currently running.",
  HISTORY_EMPTY: "History is empty.",
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  TRANSFORMATION_APPLIED: "Transformation applied successfully.",
  STATE_RESET: "State reset to initial values.",
  ANIMATION_STARTED: "Animation started.",
  ANIMATION_STOPPED: "Animation stopped.",
  STATE_EXPORTED: "State exported successfully.",
  STATE_IMPORTED: "State imported successfully.",
};

/**
 * Default shapes
 */
export const DEFAULT_SHAPES = {
  "2D": {
    TRIANGLE: [
      [100, 50],
      [200, 150],
      [50, 150],
    ],
    SQUARE: [
      [50, 50],
      [250, 50],
      [250, 250],
      [50, 250],
    ],
    RECTANGLE: [
      [50, 50],
      [250, 50],
      [250, 200],
      [50, 200],
    ],
    PENTAGON: [
      [150, 50],
      [250, 100],
      [210, 200],
      [90, 200],
      [50, 100],
    ],
    HEXAGON: [
      [200, 50],
      [280, 100],
      [280, 200],
      [200, 250],
      [120, 200],
      [120, 100],
    ],
  },
  "3D": {
    CUBE: {
      vertices: [
        [-100, -100, -100],
        [100, -100, -100],
        [100, 100, -100],
        [-100, 100, -100],
        [-100, -100, 100],
        [100, -100, 100],
        [100, 100, 100],
        [-100, 100, 100],
      ],
      faces: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [0, 1, 5, 4],
        [2, 3, 7, 6],
        [0, 3, 7, 4],
        [1, 2, 6, 5],
      ],
    },
    PYRAMID: {
      vertices: [
        [-100, 0, -100],
        [100, 0, -100],
        [100, 0, 100],
        [-100, 0, 100],
        [0, 150, 0],
      ],
      faces: [
        [0, 1, 2, 3],
        [0, 1, 4],
        [1, 2, 4],
        [2, 3, 4],
        [3, 0, 4],
      ],
    },
    TETRAHEDRON: {
      vertices: [
        [-100, -100, -100],
        [100, -100, -100],
        [0, 100, -100],
        [0, 0, 150],
      ],
      faces: [
        [0, 1, 2],
        [0, 1, 3],
        [1, 2, 3],
        [2, 0, 3],
      ],
    },
  },
};

/**
 * Easing functions
 */
export const EASING_FUNCTIONS = {
  linear: "linear",
  easeIn: "easeIn",
  easeOut: "easeOut",
  easeInOut: "easeInOut",
  easeInCubic: "easeInCubic",
  easeOutCubic: "easeOutCubic",
  easeInOutCubic: "easeInOutCubic",
  elastic: "elastic",
  bounce: "bounce",
};

export default {
  CONFIG,
  TRANSFORMATION_PRESETS,
  ANIMATION_PRESETS,
  SHORTCUTS,
  ERRORS,
  SUCCESS_MESSAGES,
  DEFAULT_SHAPES,
  EASING_FUNCTIONS,
};
