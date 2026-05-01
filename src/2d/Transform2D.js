/**
 * 2D Transformation Engine
 * Handles 2D geometric transformations with history management
 */

import {
  multiplyMatrices,
  applyTransformation,
  identityMatrix,
  generate2DTranslationMatrix,
  generate2DRotationMatrix,
  generate2DScalingMatrix,
  generate2DReflectionMatrix,
  generate2DReflectionLineMatrix,
  generate2DShearingMatrix,
  copyMatrix,
} from "../utils/matrix.js";

export class Transform2D {
  constructor() {
    this.vertices = [];
    this.currentMatrix = identityMatrix(3);
    this.history = [copyMatrix(this.currentMatrix)];
    this.historyIndex = 0;
    this.transformations = []; // Track transformation steps
  }

  /**
   * Set initial polygon vertices
   * @param {number[][]} vertices - Array of [x, y] coordinates
   */
  setVertices(vertices) {
    this.vertices = vertices.map((v) => [...v]);
  }

  /**
   * Add vertex to polygon
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  addVertex(x, y) {
    this.vertices.push([x, y]);
  }

  /**
   * Clear all vertices
   */
  clearVertices() {
    this.vertices = [];
  }

  /**
   * Get default triangle
   * @returns {number[][]} Triangle vertices
   */
  static getDefaultTriangle() {
    return [
      [100, 50],
      [200, 150],
      [50, 150],
    ];
  }

  /**
   * Get default rectangle
   * @returns {number[][]} Rectangle vertices
   */
  static getDefaultRectangle() {
    return [
      [50, 50],
      [250, 50],
      [250, 200],
      [50, 200],
    ];
  }

  /**
   * Apply transformation matrix
   * @param {number[][]} matrix - 3x3 transformation matrix
   * @param {string} name - Transformation name for history
   */
  applyMatrix(matrix, name = "Transform") {
    this.currentMatrix = multiplyMatrices(matrix, this.currentMatrix);
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(copyMatrix(this.currentMatrix));
    this.historyIndex++;
    this.transformations.push({ name, matrix: copyMatrix(matrix) });
  }

  /**
   * Translate shape
   * @param {number} tx - Translation in X
   * @param {number} ty - Translation in Y
   */
  translate(tx, ty) {
    const matrix = generate2DTranslationMatrix(tx, ty);
    this.applyMatrix(matrix, `Translate(${tx}, ${ty})`);
  }

  /**
   * Rotate shape
   * @param {number} angle - Rotation angle in degrees
   * @param {number[]} pivot - Pivot point [x, y] (optional)
   */
  rotate(angle, pivot = [0, 0]) {
    const radians = (angle * Math.PI) / 180;
    const matrix = generate2DRotationMatrix(radians, pivot);
    const pivotStr =
      pivot[0] === 0 && pivot[1] === 0 ? "origin" : `(${pivot[0]}, ${pivot[1]})`;
    this.applyMatrix(matrix, `Rotate(${angle}° about ${pivotStr})`);
  }

  /**
   * Scale shape
   * @param {number} sx - Scale factor in X
   * @param {number} sy - Scale factor in Y (optional, defaults to sx)
   * @param {number[]} pivot - Pivot point [x, y] (optional)
   */
  scale(sx, sy = sx, pivot = [0, 0]) {
    const matrix = generate2DScalingMatrix(sx, sy, pivot);
    const uniform = sx === sy ? `${sx}` : `(${sx}, ${sy})`;
    const pivotStr =
      pivot[0] === 0 && pivot[1] === 0 ? "origin" : `(${pivot[0]}, ${pivot[1]})`;
    this.applyMatrix(matrix, `Scale(${uniform} about ${pivotStr})`);
  }

  /**
   * Reflect shape
   * @param {string} axis - 'x', 'y', or 'xy'
   */
  reflect(axis = "x") {
    const matrix = generate2DReflectionMatrix(axis);
    this.applyMatrix(matrix, `Reflect(${axis}-axis)`);
  }

  /**
   * Reflect about arbitrary line
   * @param {number} angle - Line angle in degrees
   * @param {number[]} point - Point on the line
   */
  reflectLine(angle, point = [0, 0]) {
    const radians = (angle * Math.PI) / 180;
    const matrix = generate2DReflectionLineMatrix(radians, point);
    this.applyMatrix(matrix, `Reflect(line at ${angle}°)`);
  }

  /**
   * Shear shape
   * @param {number} shx - Shear factor in X
   * @param {number} shy - Shear factor in Y
   */
  shear(shx = 0, shy = 0) {
    const matrix = generate2DShearingMatrix(shx, shy);
    this.applyMatrix(matrix, `Shear(${shx}, ${shy})`);
  }

  /**
   * Get transformed vertices
   * @returns {number[][]} Transformed vertices
   */
  getTransformedVertices() {
    return this.vertices.map((vertex) => applyTransformation(vertex, this.currentMatrix));
  }

  /**
   * Get original vertices
   * @returns {number[][]} Original vertices
   */
  getOriginalVertices() {
    return this.vertices;
  }

  /**
   * Get current transformation matrix
   * @returns {number[][]} Current 3x3 matrix
   */
  getCurrentMatrix() {
    return copyMatrix(this.currentMatrix);
  }

  /**
   * Reset to identity matrix
   */
  reset() {
    this.currentMatrix = identityMatrix(3);
    this.history = [copyMatrix(this.currentMatrix)];
    this.historyIndex = 0;
    this.transformations = [];
  }

  /**
   * Undo last transformation
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.currentMatrix = copyMatrix(this.history[this.historyIndex]);
      this.transformations.pop();
    }
  }

  /**
   * Redo last undone transformation
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.currentMatrix = copyMatrix(this.history[this.historyIndex]);
      if (this.transformations.length < this.historyIndex) {
        // Rebuild transformations if needed
      }
    }
  }

  /**
   * Get transformation history
   * @returns {object[]} Array of transformation steps
   */
  getTransformationHistory() {
    return this.transformations.map((t, index) => ({
      step: index + 1,
      name: t.name,
      matrix: t.matrix,
    }));
  }

  /**
   * Apply a composite transformation (chain multiple operations)
   * @param {function[]} operations - Array of transformation functions
   */
  applyComposite(operations) {
    let compositeMatrix = identityMatrix(3);

    operations.forEach((op) => {
      const matrix = op.matrix || op;
      compositeMatrix = multiplyMatrices(matrix, compositeMatrix);
    });

    this.applyMatrix(compositeMatrix, "Composite Transform");
  }

  /**
   * Get state snapshot
   * @returns {object} Current state
   */
  getState() {
    return {
      vertices: this.vertices,
      currentMatrix: copyMatrix(this.currentMatrix),
      transformedVertices: this.getTransformedVertices(),
      transformations: this.getTransformationHistory(),
      historyIndex: this.historyIndex,
      historyLength: this.history.length,
    };
  }

  /**
   * Set state from snapshot
   * @param {object} state - State object
   */
  setState(state) {
    this.vertices = state.vertices.map((v) => [...v]);
    this.currentMatrix = copyMatrix(state.currentMatrix);
    this.historyIndex = state.historyIndex;
  }
}

export default Transform2D;
