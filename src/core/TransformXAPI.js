/**
 * TransformX Public API
 * Clean interface for accessing core functionality
 */

import TransformXCore from "./TransformXCore.js";
import { CONFIG, TRANSFORMATION_PRESETS, ANIMATION_PRESETS } from "./config.js";
import { formatMatrix } from "../utils/matrix.js";

export class TransformXAPI {
  constructor() {
    this.core = new TransformXCore();
  }

  /**
   * Initialize the application
   */
  init(mode = "2D") {
    this.core.initialize(mode);
    return this;
  }

  /**
   * ============================================
   * MODE MANAGEMENT
   * ============================================
   */

  /**
   * Switch to 2D mode
   */
  use2D() {
    this.core.switchMode("2D");
    return this;
  }

  /**
   * Switch to 3D mode
   */
  use3D() {
    this.core.switchMode("3D");
    return this;
  }

  /**
   * Get current mode
   */
  getMode() {
    return this.core.mode;
  }

  /**
   * ============================================
   * 2D TRANSFORMATIONS
   * ============================================
   */

  /**
   * Apply 2D transformation by name
   */
  apply2D(operation, params) {
    this.core.apply2DTransformation(operation, params);
    return this;
  }

  /**
   * Translate 2D shape
   */
  translate2D(tx, ty) {
    this.core.apply2DTransformation("translate", { tx, ty });
    return this;
  }

  /**
   * Rotate 2D shape
   */
  rotate2D(angle, pivot = [0, 0]) {
    this.core.apply2DTransformation("rotate", { angle, pivot });
    return this;
  }

  /**
   * Scale 2D shape
   */
  scale2D(sx, sy = sx, pivot = [0, 0]) {
    this.core.apply2DTransformation("scale", { sx, sy, pivot });
    return this;
  }

  /**
   * Reflect 2D shape
   */
  reflect2D(axis = "x") {
    this.core.apply2DTransformation("reflect", { axis });
    return this;
  }

  /**
   * Shear 2D shape
   */
  shear2D(shx = 0, shy = 0) {
    this.core.apply2DTransformation("shear", { shx, shy });
    return this;
  }

  /**
   * ============================================
   * 3D TRANSFORMATIONS
   * ============================================
   */

  /**
   * Apply 3D transformation by name
   */
  apply3D(operation, params) {
    this.core.apply3DTransformation(operation, params);
    return this;
  }

  /**
   * Translate 3D object
   */
  translate3D(tx, ty, tz) {
    this.core.apply3DTransformation("translate", { tx, ty, tz });
    return this;
  }

  /**
   * Rotate 3D object around X axis
   */
  rotateX(angle) {
    this.core.apply3DTransformation("rotateX", { angle });
    return this;
  }

  /**
   * Rotate 3D object around Y axis
   */
  rotateY(angle) {
    this.core.apply3DTransformation("rotateY", { angle });
    return this;
  }

  /**
   * Rotate 3D object around Z axis
   */
  rotateZ(angle) {
    this.core.apply3DTransformation("rotateZ", { angle });
    return this;
  }

  /**
   * Rotate 3D object with Euler angles
   */
  rotateEuler(angleX, angleY, angleZ) {
    this.core.apply3DTransformation("rotateEuler", { angleX, angleY, angleZ });
    return this;
  }

  /**
   * Scale 3D object
   */
  scale3D(sx, sy = sx, sz = sx) {
    this.core.apply3DTransformation("scale", { sx, sy, sz });
    return this;
  }

  /**
   * ============================================
   * ANIMATION
   * ============================================
   */

  /**
   * Start animation
   */
  animate(mode, params, duration = 3000) {
    this.core.startAnimation(mode, params, duration);
    return this;
  }

  /**
   * Animate 2D rotation
   */
  animate2DRotate(angle = 360, duration = 4000) {
    this.core.startAnimation("rotate", { angle }, duration);
    return this;
  }

  /**
   * Animate 2D scaling
   */
  animate2DScale(sx = 2, sy = 2, duration = 3000) {
    this.core.startAnimation("scale", { sx, sy }, duration);
    return this;
  }

  /**
   * Animate 3D rotation
   */
  animate3DRotate(angleX = 360, angleY = 360, angleZ = 0, duration = 5000) {
    this.core.startAnimation("rotateEuler", { angleX, angleY, angleZ }, duration);
    return this;
  }

  /**
   * Stop current animation
   */
  stopAnimation() {
    this.core.animationManager.stop();
    return this;
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
    this.core.undo();
    return this;
  }

  /**
   * Redo last undone transformation
   */
  redo() {
    this.core.redo();
    return this;
  }

  /**
   * Reset to initial state
   */
  reset() {
    this.core.reset();
    return this;
  }

  /**
   * Get transformation history
   */
  getHistory() {
    return this.core.getTransformationHistory();
  }

  /**
   * ============================================
   * STATE MANAGEMENT
   * ============================================
   */

  /**
   * Get full application state
   */
  getState() {
    return this.core.getState();
  }

  /**
   * Get current transformation matrix
   */
  getMatrix() {
    return this.core.getCurrentMatrix();
  }

  /**
   * Get matrix formatted as string
   */
  getMatrixString() {
    return formatMatrix(this.getMatrix(), CONFIG.MATRIX.PRECISION);
  }

  /**
   * Get 2D vertices
   */
  getVertices() {
    if (this.core.mode === "2D") {
      return this.core.get2DTransformedVertices();
    } else {
      return this.core.get3DTransformedVertices();
    }
  }

  /**
   * Get original vertices
   */
  getOriginalVertices() {
    if (this.core.mode === "2D") {
      return this.core.get2DVertices();
    } else {
      return this.core.get3DVertices();
    }
  }

  /**
   * Get 3D faces
   */
  getFaces() {
    return this.core.get3DFaces();
  }

  /**
   * Export state as JSON string
   */
  exportState() {
    return this.core.exportState();
  }

  /**
   * Import state from JSON string
   */
  importState(jsonString) {
    return this.core.importState(jsonString);
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
    this.core.onStateChange(callback);
    return this;
  }

  /**
   * Register frame update callback
   */
  onFrame(callback) {
    this.core.onFrame(callback);
    return this;
  }

  /**
   * Register animation complete callback
   */
  onAnimationComplete(callback) {
    this.core.onAnimationComplete(callback);
    return this;
  }

  /**
   * ============================================
   * UTILITY
   * ============================================
   */

  /**
   * Update application state (call from animation loop)
   */
  update() {
    this.core.update();
    return this;
  }

  /**
   * Start application
   */
  start() {
    this.core.resume();
    return this;
  }

  /**
   * Stop application
   */
  stop() {
    this.core.stop();
    return this;
  }

  /**
   * Get configuration
   */
  getConfig() {
    return CONFIG;
  }

  /**
   * Get transformation presets
   */
  getPresets() {
    return {
      transformations: TRANSFORMATION_PRESETS,
      animations: ANIMATION_PRESETS,
    };
  }

  /**
   * Create batch operations
   */
  batch() {
    return {
      add: (operation, params) => {
        this.core.batch.add({ operation, parameters: params });
        return this;
      },
      execute: () => {
        return this.core.batch.executeBatch();
      },
    };
  }
}

export default TransformXAPI;
