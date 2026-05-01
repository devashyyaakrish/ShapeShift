/**
 * 3D Transformation Engine
 * Handles 3D geometric transformations with history management
 */

import {
  multiplyMatrices,
  applyTransformation,
  identityMatrix,
  generate3DTranslationMatrix,
  generate3DRotationMatrixX,
  generate3DRotationMatrixY,
  generate3DRotationMatrixZ,
  generate3DScalingMatrix,
  copyMatrix,
  homogenousTo3D,
} from "../utils/matrix.js";

export class Transform3D {
  constructor() {
    this.vertices = [];
    this.faces = [];
    this.currentMatrix = identityMatrix(4);
    this.history = [copyMatrix(this.currentMatrix)];
    this.historyIndex = 0;
    this.transformations = [];
  }

  /**
   * Set vertices for 3D object
   * @param {number[][]} vertices - Array of [x, y, z] coordinates
   */
  setVertices(vertices) {
    this.vertices = vertices.map((v) => [...v]);
  }

  /**
   * Set faces (for rendering)
   * @param {number[][]} faces - Array of vertex indices for each face
   */
  setFaces(faces) {
    this.faces = faces.map((f) => [...f]);
  }

  /**
   * Get default cube
   * @returns {object} Cube with vertices and faces
   */
  static getDefaultCube() {
    const size = 100;
    return {
      vertices: [
        [-size, -size, -size],
        [size, -size, -size],
        [size, size, -size],
        [-size, size, -size],
        [-size, -size, size],
        [size, -size, size],
        [size, size, size],
        [-size, size, size],
      ],
      faces: [
        [0, 1, 2, 3], // Front
        [4, 5, 6, 7], // Back
        [0, 1, 5, 4], // Bottom
        [2, 3, 7, 6], // Top
        [0, 3, 7, 4], // Left
        [1, 2, 6, 5], // Right
      ],
    };
  }

  /**
   * Get default pyramid
   * @returns {object} Pyramid with vertices and faces
   */
  static getDefaultPyramid() {
    return {
      vertices: [
        [-100, 0, -100], // Base corners
        [100, 0, -100],
        [100, 0, 100],
        [-100, 0, 100],
        [0, 150, 0], // Apex
      ],
      faces: [
        [0, 1, 2, 3], // Base
        [0, 1, 4], // Side faces
        [1, 2, 4],
        [2, 3, 4],
        [3, 0, 4],
      ],
    };
  }

  /**
   * Apply transformation matrix
   * @param {number[][]} matrix - 4x4 transformation matrix
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
   * Translate in 3D space
   * @param {number} tx - Translation in X
   * @param {number} ty - Translation in Y
   * @param {number} tz - Translation in Z
   */
  translate(tx, ty, tz) {
    const matrix = generate3DTranslationMatrix(tx, ty, tz);
    this.applyMatrix(matrix, `Translate(${tx}, ${ty}, ${tz})`);
  }

  /**
   * Rotate around X axis
   * @param {number} angle - Rotation angle in degrees
   */
  rotateX(angle) {
    const radians = (angle * Math.PI) / 180;
    const matrix = generate3DRotationMatrixX(radians);
    this.applyMatrix(matrix, `Rotate X(${angle}°)`);
  }

  /**
   * Rotate around Y axis
   * @param {number} angle - Rotation angle in degrees
   */
  rotateY(angle) {
    const radians = (angle * Math.PI) / 180;
    const matrix = generate3DRotationMatrixY(radians);
    this.applyMatrix(matrix, `Rotate Y(${angle}°)`);
  }

  /**
   * Rotate around Z axis
   * @param {number} angle - Rotation angle in degrees
   */
  rotateZ(angle) {
    const radians = (angle * Math.PI) / 180;
    const matrix = generate3DRotationMatrixZ(radians);
    this.applyMatrix(matrix, `Rotate Z(${angle}°)`);
  }

  /**
   * Rotate around arbitrary axis (Euler angles)
   * @param {number} angleX - Rotation around X axis in degrees
   * @param {number} angleY - Rotation around Y axis in degrees
   * @param {number} angleZ - Rotation around Z axis in degrees
   */
  rotateEuler(angleX, angleY, angleZ) {
    const radX = (angleX * Math.PI) / 180;
    const radY = (angleY * Math.PI) / 180;
    const radZ = (angleZ * Math.PI) / 180;

    const matX = generate3DRotationMatrixX(radX);
    const matY = generate3DRotationMatrixY(radY);
    const matZ = generate3DRotationMatrixZ(radZ);

    let result = multiplyMatrices(matZ, multiplyMatrices(matY, matX));
    this.applyMatrix(result, `Rotate(${angleX}°, ${angleY}°, ${angleZ}°)`);
  }

  /**
   * Scale in 3D space
   * @param {number} sx - Scale factor in X
   * @param {number} sy - Scale factor in Y
   * @param {number} sz - Scale factor in Z
   */
  scale(sx, sy = sx, sz = sx) {
    const matrix = generate3DScalingMatrix(sx, sy, sz);
    const uniform = sx === sy && sy === sz ? `${sx}` : `(${sx}, ${sy}, ${sz})`;
    this.applyMatrix(matrix, `Scale(${uniform})`);
  }

  /**
   * Get transformed vertices
   * @returns {number[][]} Transformed vertices
   */
  getTransformedVertices() {
    return this.vertices.map((vertex) => {
      const homogeneous = applyTransformation(vertex, this.currentMatrix);
      return homogenousTo3D(homogeneous);
    });
  }

  /**
   * Get original vertices
   * @returns {number[][]} Original vertices
   */
  getOriginalVertices() {
    return this.vertices;
  }

  /**
   * Get faces
   * @returns {number[][]} Face indices
   */
  getFaces() {
    return this.faces;
  }

  /**
   * Get current transformation matrix
   * @returns {number[][]} Current 4x4 matrix
   */
  getCurrentMatrix() {
    return copyMatrix(this.currentMatrix);
  }

  /**
   * Reset to identity matrix
   */
  reset() {
    this.currentMatrix = identityMatrix(4);
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
   * Get complete object state
   * @returns {object} Current state
   */
  getState() {
    return {
      vertices: this.vertices,
      faces: this.faces,
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
    this.faces = state.faces.map((f) => [...f]);
    this.currentMatrix = copyMatrix(state.currentMatrix);
    this.historyIndex = state.historyIndex;
  }
}

export default Transform3D;
