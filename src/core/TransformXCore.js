/**
 * Core Application Engine
 * Orchestrates 2D/3D transformations, animations, and state management
 */

import Transform2D from "../2d/Transform2D.js";
import Transform3D from "../3d/Transform3D.js";
import { AnimationManager, TransitionManager } from "./AnimationManager.js";
import {
  HistoryManager,
  TransformationPipeline,
  TransformationBatch,
} from "./HistoryManager.js";

export class TransformXCore {
  constructor() {
    // Transformation engines
    this.transform2D = new Transform2D();
    this.transform3D = new Transform3D();

    // Animation and transition managers
    this.animationManager = new AnimationManager();
    this.transitionManager = new TransitionManager();

    // History and pipeline managers
    this.historyManager = new HistoryManager();
    this.pipeline = new TransformationPipeline();
    this.batch = new TransformationBatch();

    // Application state
    this.mode = "2D"; // '2D' or '3D'
    this.isRunning = false;
    this.frameCount = 0;
    this.deltaTime = 0;
    this.lastFrameTime = Date.now();

    // Callbacks
    this.callbacks = {
      onStateChange: null,
      onFrame: null,
      onAnimationComplete: null,
    };
  }

  /**
   * Initialize application
   * @param {string} defaultMode - Starting mode ('2D' or '3D')
   */
  initialize(defaultMode = "2D") {
    this.mode = defaultMode;

    if (defaultMode === "2D") {
      this.transform2D.setVertices(Transform2D.getDefaultTriangle());
    } else {
      const pyramid = Transform3D.getDefaultPyramid();
      this.transform3D.setVertices(pyramid.vertices);
      this.transform3D.setFaces(pyramid.faces);
    }

    this.isRunning = true;
    this.updateHistory();
  }

  /**
   * Switch between 2D and 3D modes
   * @param {string} newMode - Target mode
   */
  switchMode(newMode) {
    if (newMode !== this.mode) {
      this.mode = newMode;
      this.updateHistory();
      this.notifyStateChange();
    }
  }

  /**
   * UPDATE HISTORY - Save current state
   */
  updateHistory() {
    const state = this.getState();
    this.historyManager.pushState(state, `${this.mode} Transform`);
  }

  /**
   * ============================================
   * 2D TRANSFORMATION METHODS
   * ============================================
   */

  /**
   * Apply 2D transformation
   */
  apply2DTransformation(operation, params) {
    if (this.mode !== "2D") return;

    switch (operation) {
      case "translate":
        this.transform2D.translate(params.tx, params.ty);
        break;
      case "rotate":
        this.transform2D.rotate(params.angle, params.pivot);
        break;
      case "scale":
        this.transform2D.scale(params.sx, params.sy, params.pivot);
        break;
      case "reflect":
        this.transform2D.reflect(params.axis);
        break;
      case "reflectLine":
        this.transform2D.reflectLine(params.angle, params.point);
        break;
      case "shear":
        this.transform2D.shear(params.shx, params.shy);
        break;
    }

    this.updateHistory();
    this.notifyStateChange();
  }

  /**
   * ============================================
   * 3D TRANSFORMATION METHODS
   * ============================================
   */

  /**
   * Apply 3D transformation
   */
  apply3DTransformation(operation, params) {
    if (this.mode !== "3D") return;

    switch (operation) {
      case "translate":
        this.transform3D.translate(params.tx, params.ty, params.tz);
        break;
      case "rotateX":
        this.transform3D.rotateX(params.angle);
        break;
      case "rotateY":
        this.transform3D.rotateY(params.angle);
        break;
      case "rotateZ":
        this.transform3D.rotateZ(params.angle);
        break;
      case "rotateEuler":
        this.transform3D.rotateEuler(params.angleX, params.angleY, params.angleZ);
        break;
      case "scale":
        this.transform3D.scale(params.sx, params.sy, params.sz);
        break;
    }

    this.updateHistory();
    this.notifyStateChange();
  }

  /**
   * ============================================
   * ANIMATION METHODS
   * ============================================
   */

  /**
   * Start animation
   * @param {string} mode - Animation mode
   * @param {object} params - Animation parameters
   * @param {number} duration - Duration in ms
   */
  startAnimation(mode, params = {}, duration = 3000) {
    const onFrame = (state) => {
      const progress = state.progress;

      if (this.mode === "2D") {
        // Interpolate 2D transformations
        const interpolated = this.interpolate2DAnimation(mode, params, progress);
        if (interpolated.operation) {
          this.apply2DTransformation(interpolated.operation, interpolated.params);
        }
      } else {
        // Interpolate 3D transformations
        const interpolated = this.interpolate3DAnimation(mode, params, progress);
        if (interpolated.operation) {
          this.apply3DTransformation(interpolated.operation, interpolated.params);
        }
      }
    };

    const onComplete = (state) => {
      if (this.callbacks.onAnimationComplete) {
        this.callbacks.onAnimationComplete(state);
      }
    };

    this.animationManager.start(mode, params, duration, onFrame, onComplete);
  }

  /**
   * Interpolate 2D animation
   */
  interpolate2DAnimation(mode, params, progress) {
    const result = { operation: null, params: {} };

    switch (mode) {
      case "rotate":
        result.operation = "rotate";
        result.params = {
          angle: params.angle * progress,
          pivot: params.pivot || [0, 0],
        };
        break;
      case "scale":
        result.operation = "scale";
        result.params = {
          sx: 1 + (params.sx - 1) * progress,
          sy: 1 + (params.sy - 1) * progress,
          pivot: params.pivot || [0, 0],
        };
        break;
      case "translate":
        result.operation = "translate";
        result.params = {
          tx: params.tx * progress,
          ty: params.ty * progress,
        };
        break;
    }

    return result;
  }

  /**
   * Interpolate 3D animation
   */
  interpolate3DAnimation(mode, params, progress) {
    const result = { operation: null, params: {} };

    switch (mode) {
      case "rotateEuler":
        result.operation = "rotateEuler";
        result.params = {
          angleX: params.angleX * progress,
          angleY: params.angleY * progress,
          angleZ: params.angleZ * progress,
        };
        break;
      case "scale":
        result.operation = "scale";
        result.params = {
          sx: 1 + (params.sx - 1) * progress,
          sy: 1 + (params.sy - 1) * progress,
          sz: 1 + (params.sz - 1) * progress,
        };
        break;
      case "translate":
        result.operation = "translate";
        result.params = {
          tx: params.tx * progress,
          ty: params.ty * progress,
          tz: params.tz * progress,
        };
        break;
    }

    return result;
  }

  /**
   * ============================================
   * HISTORY MANAGEMENT
   * ============================================
   */

  /**
   * Undo last transformation
   */
  undo() {
    if (this.mode === "2D") {
      this.transform2D.undo();
    } else {
      this.transform3D.undo();
    }
    this.notifyStateChange();
  }

  /**
   * Redo last undone transformation
   */
  redo() {
    if (this.mode === "2D") {
      this.transform2D.redo();
    } else {
      this.transform3D.redo();
    }
    this.notifyStateChange();
  }

  /**
   * Reset to initial state
   */
  reset() {
    if (this.mode === "2D") {
      this.transform2D.reset();
    } else {
      this.transform3D.reset();
    }
    this.updateHistory();
    this.notifyStateChange();
  }

  /**
   * ============================================
   * STATE MANAGEMENT
   * ============================================
   */

  /**
   * Get complete application state
   * @returns {object}
   */
  getState() {
    const state = {
      mode: this.mode,
      timestamp: Date.now(),
      frameCount: this.frameCount,
    };

    if (this.mode === "2D") {
      state.transform2D = this.transform2D.getState();
    } else {
      state.transform3D = this.transform3D.getState();
    }

    state.animation = this.animationManager.getState();
    state.history = this.historyManager.getState();
    state.pipeline = this.pipeline.getState();

    return state;
  }

  /**
   * Get transformation history for current mode
   * @returns {object[]}
   */
  getTransformationHistory() {
    return this.mode === "2D"
      ? this.transform2D.getTransformationHistory()
      : this.transform3D.getTransformationHistory();
  }

  /**
   * Get current transformation matrix
   * @returns {number[][]}
   */
  getCurrentMatrix() {
    return this.mode === "2D"
      ? this.transform2D.getCurrentMatrix()
      : this.transform3D.getCurrentMatrix();
  }

  /**
   * ============================================
   * FRAME UPDATE & ANIMATION LOOP
   * ============================================
   */

  /**
   * Update application state (should be called from animation loop)
   */
  update() {
    const now = Date.now();
    this.deltaTime = now - this.lastFrameTime;
    this.lastFrameTime = now;
    this.frameCount++;

    // Update animation
    this.animationManager.update();

    // Update transitions
    this.transitionManager.update();

    // Call user callback
    if (this.callbacks.onFrame) {
      this.callbacks.onFrame(this.getState());
    }
  }

  /**
   * ============================================
   * CALLBACKS
   * ============================================
   */

  /**
   * Register state change callback
   */
  onStateChange(callback) {
    this.callbacks.onStateChange = callback;
  }

  /**
   * Register frame update callback
   */
  onFrame(callback) {
    this.callbacks.onFrame = callback;
  }

  /**
   * Register animation complete callback
   */
  onAnimationComplete(callback) {
    this.callbacks.onAnimationComplete = callback;
  }

  /**
   * Notify state change
   */
  notifyStateChange() {
    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange(this.getState());
    }
  }

  /**
   * ============================================
   * UTILITY METHODS
   * ============================================
   */

  /**
   * Get 2D vertices (original)
   */
  get2DVertices() {
    return this.transform2D.getOriginalVertices();
  }

  /**
   * Get 2D transformed vertices
   */
  get2DTransformedVertices() {
    return this.transform2D.getTransformedVertices();
  }

  /**
   * Get 3D vertices (original)
   */
  get3DVertices() {
    return this.transform3D.getOriginalVertices();
  }

  /**
   * Get 3D transformed vertices
   */
  get3DTransformedVertices() {
    return this.transform3D.getTransformedVertices();
  }

  /**
   * Get 3D faces
   */
  get3DFaces() {
    return this.transform3D.getFaces();
  }

  /**
   * Stop application
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Resume application
   */
  resume() {
    this.isRunning = true;
    this.lastFrameTime = Date.now();
  }

  /**
   * Export state as JSON
   */
  exportState() {
    return JSON.stringify(this.getState(), null, 2);
  }

  /**
   * Import state from JSON
   */
  importState(jsonString) {
    try {
      const state = JSON.parse(jsonString);
      if (state.mode === "2D" && state.transform2D) {
        this.transform2D.setState(state.transform2D);
      } else if (state.mode === "3D" && state.transform3D) {
        this.transform3D.setState(state.transform3D);
      }
      this.mode = state.mode;
      this.notifyStateChange();
      return true;
    } catch (error) {
      console.error("Failed to import state:", error);
      return false;
    }
  }
}

export default TransformXCore;
