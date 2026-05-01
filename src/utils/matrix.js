/**
 * Matrix Utilities - Core mathematical operations for 2D and 3D transformations
 * Uses homogeneous coordinates (2D: 3x3, 3D: 4x4)
 */

/**
 * Multiply two matrices
 * @param {number[][]} matA - First matrix
 * @param {number[][]} matB - Second matrix
 * @returns {number[][]} Result matrix
 */
export function multiplyMatrices(matA, matB) {
  const rows = matA.length;
  const cols = matB[0].length;
  const common = matA[0].length;

  const result = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < common; k++) {
        result[i][j] += matA[i][k] * matB[k][j];
      }
    }
  }

  return result;
}

/**
 * Apply transformation matrix to a point
 * @param {number[]} point - Point coordinates (2D or 3D)
 * @param {number[][]} matrix - Transformation matrix (3x3 for 2D, 4x4 for 3D)
 * @returns {number[]} Transformed point
 */
export function applyTransformation(point, matrix) {
  const dimension = point.length;
  const homogeneous = [...point, 1]; // Add homogeneous coordinate

  const result = Array(dimension).fill(0);

  for (let i = 0; i < dimension; i++) {
    for (let j = 0; j < homogeneous.length; j++) {
      result[i] += matrix[i][j] * homogeneous[j];
    }
  }

  return result;
}

/**
 * Generate identity matrix
 * @param {number} size - Matrix size (3 for 2D, 4 for 3D)
 * @returns {number[][]} Identity matrix
 */
export function identityMatrix(size) {
  const matrix = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));

  for (let i = 0; i < size; i++) {
    matrix[i][i] = 1;
  }

  return matrix;
}

/**
 * 2D TRANSFORMATIONS - Using 3x3 homogeneous matrices
 */

/**
 * Generate 2D translation matrix
 * @param {number} tx - Translation in X
 * @param {number} ty - Translation in Y
 * @returns {number[][]} 3x3 translation matrix
 */
export function generate2DTranslationMatrix(tx, ty) {
  return [
    [1, 0, tx],
    [0, 1, ty],
    [0, 0, 1],
  ];
}

/**
 * Generate 2D rotation matrix (counter-clockwise, in radians)
 * @param {number} angle - Rotation angle in radians
 * @param {number[]} pivot - Pivot point [x, y] (optional, default: origin)
 * @returns {number[][]} 3x3 rotation matrix
 */
export function generate2DRotationMatrix(angle, pivot = [0, 0]) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const [px, py] = pivot;

  if (px === 0 && py === 0) {
    // Rotation about origin
    return [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1],
    ];
  }

  // Rotation about pivot point: T(px,py) * R(θ) * T(-px,-py)
  const translateToPivot = generate2DTranslationMatrix(px, py);
  const rotate = [
    [cos, -sin, 0],
    [sin, cos, 0],
    [0, 0, 1],
  ];
  const translateFromPivot = generate2DTranslationMatrix(-px, -py);

  let result = multiplyMatrices(rotate, translateFromPivot);
  result = multiplyMatrices(translateToPivot, result);

  return result;
}

/**
 * Generate 2D scaling matrix
 * @param {number} sx - Scale factor in X
 * @param {number} sy - Scale factor in Y
 * @param {number[]} pivot - Pivot point [x, y] (optional, default: origin)
 * @returns {number[][]} 3x3 scaling matrix
 */
export function generate2DScalingMatrix(sx, sy, pivot = [0, 0]) {
  const [px, py] = pivot;

  if (px === 0 && py === 0) {
    // Scaling about origin
    return [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ];
  }

  // Scaling about pivot: T(px,py) * S(sx,sy) * T(-px,-py)
  const translateToPivot = generate2DTranslationMatrix(px, py);
  const scale = [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1],
  ];
  const translateFromPivot = generate2DTranslationMatrix(-px, -py);

  let result = multiplyMatrices(scale, translateFromPivot);
  result = multiplyMatrices(translateToPivot, result);

  return result;
}

/**
 * Generate 2D reflection matrix
 * @param {string} axis - 'x', 'y', or 'xy' (for both/diagonal)
 * @returns {number[][]} 3x3 reflection matrix
 */
export function generate2DReflectionMatrix(axis = 'x') {
  if (axis === 'x') {
    return [
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ];
  } else if (axis === 'y') {
    return [
      [-1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  } else if (axis === 'xy') {
    // Reflection about y=x (diagonal)
    return [
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
    ];
  }
  return identityMatrix(3);
}

/**
 * Generate 2D reflection about arbitrary line
 * @param {number} angle - Line angle in radians
 * @param {number[]} point - Point on the line [x, y]
 * @returns {number[][]} 3x3 reflection matrix
 */
export function generate2DReflectionLineMatrix(angle, point = [0, 0]) {
  const cos2a = Math.cos(2 * angle);
  const sin2a = Math.sin(2 * angle);
  const [px, py] = point;

  // Reflection about line through point at angle
  const rotate1 = [
    [cos2a, sin2a, 0],
    [sin2a, -cos2a, 0],
    [0, 0, 1],
  ];

  let result = rotate1;

  // If line doesn't pass through origin, translate
  if (px !== 0 || py !== 0) {
    const t1 = generate2DTranslationMatrix(px, py);
    const t2 = generate2DTranslationMatrix(-px, -py);
    result = multiplyMatrices(t1, multiplyMatrices(rotate1, t2));
  }

  return result;
}

/**
 * Generate 2D shearing matrix
 * @param {number} shx - Shear factor in X direction
 * @param {number} shy - Shear factor in Y direction
 * @returns {number[][]} 3x3 shearing matrix
 */
export function generate2DShearingMatrix(shx = 0, shy = 0) {
  return [
    [1, shx, 0],
    [shy, 1, 0],
    [0, 0, 1],
  ];
}

/**
 * 3D TRANSFORMATIONS - Using 4x4 homogeneous matrices
 */

/**
 * Generate 3D translation matrix
 * @param {number} tx - Translation in X
 * @param {number} ty - Translation in Y
 * @param {number} tz - Translation in Z
 * @returns {number[][]} 4x4 translation matrix
 */
export function generate3DTranslationMatrix(tx, ty, tz) {
  return [
    [1, 0, 0, tx],
    [0, 1, 0, ty],
    [0, 0, 1, tz],
    [0, 0, 0, 1],
  ];
}

/**
 * Generate 3D rotation matrix around X axis
 * @param {number} angle - Rotation angle in radians
 * @returns {number[][]} 4x4 rotation matrix
 */
export function generate3DRotationMatrixX(angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return [
    [1, 0, 0, 0],
    [0, cos, -sin, 0],
    [0, sin, cos, 0],
    [0, 0, 0, 1],
  ];
}

/**
 * Generate 3D rotation matrix around Y axis
 * @param {number} angle - Rotation angle in radians
 * @returns {number[][]} 4x4 rotation matrix
 */
export function generate3DRotationMatrixY(angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return [
    [cos, 0, sin, 0],
    [0, 1, 0, 0],
    [-sin, 0, cos, 0],
    [0, 0, 0, 1],
  ];
}

/**
 * Generate 3D rotation matrix around Z axis
 * @param {number} angle - Rotation angle in radians
 * @returns {number[][]} 4x4 rotation matrix
 */
export function generate3DRotationMatrixZ(angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return [
    [cos, -sin, 0, 0],
    [sin, cos, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

/**
 * Generate 3D scaling matrix
 * @param {number} sx - Scale factor in X
 * @param {number} sy - Scale factor in Y
 * @param {number} sz - Scale factor in Z
 * @returns {number[][]} 4x4 scaling matrix
 */
export function generate3DScalingMatrix(sx, sy, sz) {
  return [
    [sx, 0, 0, 0],
    [0, sy, 0, 0],
    [0, 0, sz, 0],
    [0, 0, 0, 1],
  ];
}

/**
 * Convert 2D homogeneous coordinates to 2D Cartesian
 * @param {number[]} point - Point with homogeneous coordinate [x, y, w]
 * @returns {number[]} 2D Cartesian coordinates [x', y']
 */
export function homogenousTo2D(point) {
  if (point[2] === 0) return [point[0], point[1]];
  return [point[0] / point[2], point[1] / point[2]];
}

/**
 * Convert 3D homogeneous coordinates to 3D Cartesian
 * @param {number[]} point - Point with homogeneous coordinate [x, y, z, w]
 * @returns {number[]} 3D Cartesian coordinates [x', y', z']
 */
export function homogenousTo3D(point) {
  if (point[3] === 0) return [point[0], point[1], point[2]];
  return [point[0] / point[3], point[1] / point[3], point[2] / point[3]];
}

/**
 * Format matrix for display
 * @param {number[][]} matrix - Matrix to format
 * @param {number} precision - Decimal places (default: 2)
 * @returns {string} Formatted matrix string
 */
export function formatMatrix(matrix, precision = 2) {
  return matrix
    .map((row) => `[${row.map((val) => val.toFixed(precision)).join(", ")}]`)
    .join("\n");
}

/**
 * Create a deep copy of a matrix
 * @param {number[][]} matrix - Matrix to copy
 * @returns {number[][]} Deep copy of matrix
 */
export function copyMatrix(matrix) {
  return matrix.map((row) => [...row]);
}
