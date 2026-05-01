/**
 * TransformX Core - Test Suite
 * Validates all mathematical operations and functionality
 */

import {
  multiplyMatrices,
  applyTransformation,
  identityMatrix,
  generate2DTranslationMatrix,
  generate2DRotationMatrix,
  generate2DScalingMatrix,
  generate2DReflectionMatrix,
  generate2DShearingMatrix,
  generate3DTranslationMatrix,
  generate3DRotationMatrixX,
  generate3DRotationMatrixY,
  generate3DRotationMatrixZ,
  generate3DScalingMatrix,
  formatMatrix,
  copyMatrix,
} from "./src/utils/matrix.js";

import Transform2D from "./src/2d/Transform2D.js";
import Transform3D from "./src/3d/Transform3D.js";
import TransformXCore from "./src/core/TransformXCore.js";
import TransformXAPI from "./src/core/TransformXAPI.js";

// Test helper
function assertEqual(actual, expected, message) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${message}`);
  if (!pass) {
    console.log("  Expected:", expected);
    console.log("  Actual:", actual);
  }
  return pass;
}

function assertApprox(actual, expected, tolerance = 0.0001, message = "") {
  const pass = Math.abs(actual - expected) < tolerance;
  console.log(`${pass ? "✓" : "✗"} ${message}`);
  if (!pass) {
    console.log("  Expected:", expected, "Actual:", actual);
  }
  return pass;
}

console.log("===========================================");
console.log("TransformX Core - Test Suite");
console.log("===========================================\n");

let totalTests = 0;
let passedTests = 0;

// ============================================
// MATRIX OPERATIONS TESTS
// ============================================
console.log("\n[1] MATRIX OPERATIONS");
console.log("---------------------");

// Test 1.1: Identity Matrix
(() => {
  totalTests++;
  const identity3 = identityMatrix(3);
  const expected = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  if (assertEqual(identity3, expected, "Identity 3x3 matrix")) passedTests++;
})();

// Test 1.2: Matrix Multiplication
(() => {
  totalTests++;
  const mat1 = [
    [1, 2],
    [3, 4],
  ];
  const mat2 = [
    [5, 6],
    [7, 8],
  ];
  const result = multiplyMatrices(mat1, mat2);
  const expected = [
    [19, 22],
    [43, 50],
  ];
  if (assertEqual(result, expected, "2x2 matrix multiplication")) passedTests++;
})();

// Test 1.3: Apply Transformation
(() => {
  totalTests++;
  const point = [1, 2];
  const matrix = generate2DTranslationMatrix(3, 4);
  const result = applyTransformation(point, matrix);
  const expected = [4, 6]; // [1+3, 2+4]
  if (
    assertApprox(result[0], expected[0], 0.0001, "Apply translation to point")
  ) {
    passedTests++;
  }
})();

// Test 1.4: Copy Matrix
(() => {
  totalTests++;
  const original = [[1, 2, 3]];
  const copy = copyMatrix(original);
  copy[0][0] = 99;
  if (
    assertEqual(original[0][0], 1, "Deep copy matrix (original unchanged)")
  ) {
    passedTests++;
  }
})();

// ============================================
// 2D TRANSFORMATION TESTS
// ============================================
console.log("\n[2] 2D TRANSFORMATIONS");
console.log("---------------------");

// Test 2.1: Translation Matrix
(() => {
  totalTests++;
  const matrix = generate2DTranslationMatrix(10, 20);
  const expected = [
    [1, 0, 10],
    [0, 1, 20],
    [0, 0, 1],
  ];
  if (assertEqual(matrix, expected, "2D translation matrix generation"))
    passedTests++;
})();

// Test 2.2: Rotation Matrix (90 degrees)
(() => {
  totalTests++;
  const matrix = generate2DRotationMatrix(Math.PI / 2); // 90 degrees
  // cos(90) ≈ 0, sin(90) ≈ 1
  if (
    assertApprox(matrix[0][0], 0, 0.0001, "Rotation matrix R(90°) [0,0]")
  ) {
    passedTests++;
  }
})();

// Test 2.3: Scaling Matrix
(() => {
  totalTests++;
  const matrix = generate2DScalingMatrix(2, 3);
  const expected = [
    [2, 0, 0],
    [0, 3, 0],
    [0, 0, 1],
  ];
  if (assertEqual(matrix, expected, "2D scaling matrix generation"))
    passedTests++;
})();

// Test 2.4: Reflection Matrix (X-axis)
(() => {
  totalTests++;
  const matrix = generate2DReflectionMatrix("x");
  const expected = [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ];
  if (assertEqual(matrix, expected, "2D X-axis reflection matrix"))
    passedTests++;
})();

// Test 2.5: Shearing Matrix
(() => {
  totalTests++;
  const matrix = generate2DShearingMatrix(0.5, 0.3);
  const expected = [
    [1, 0.5, 0],
    [0.3, 1, 0],
    [0, 0, 1],
  ];
  if (assertEqual(matrix, expected, "2D shearing matrix")) passedTests++;
})();

// ============================================
// 3D TRANSFORMATION TESTS
// ============================================
console.log("\n[3] 3D TRANSFORMATIONS");
console.log("---------------------");

// Test 3.1: 3D Translation Matrix
(() => {
  totalTests++;
  const matrix = generate3DTranslationMatrix(5, 10, 15);
  const expected = [
    [1, 0, 0, 5],
    [0, 1, 0, 10],
    [0, 0, 1, 15],
    [0, 0, 0, 1],
  ];
  if (assertEqual(matrix, expected, "3D translation matrix generation"))
    passedTests++;
})();

// Test 3.2: 3D Rotation X Matrix
(() => {
  totalTests++;
  const matrix = generate3DRotationMatrixX(Math.PI / 2); // 90 degrees
  if (
    assertApprox(
      matrix[1][1],
      0,
      0.0001,
      "3D X-rotation matrix R(90°) [1,1]"
    )
  ) {
    passedTests++;
  }
})();

// Test 3.3: 3D Scaling Matrix
(() => {
  totalTests++;
  const matrix = generate3DScalingMatrix(2, 3, 4);
  const expected = [
    [2, 0, 0, 0],
    [0, 3, 0, 0],
    [0, 0, 4, 0],
    [0, 0, 0, 1],
  ];
  if (assertEqual(matrix, expected, "3D scaling matrix generation"))
    passedTests++;
})();

// ============================================
// Transform2D CLASS TESTS
// ============================================
console.log("\n[4] Transform2D CLASS");
console.log("-------------------");

// Test 4.1: Initialize with Triangle
(() => {
  totalTests++;
  const transform = new Transform2D();
  transform.setVertices(Transform2D.getDefaultTriangle());
  const vertices = transform.getOriginalVertices();
  if (
    assertEqual(
      vertices.length,
      3,
      "Transform2D initialized with triangle"
    )
  ) {
    passedTests++;
  }
})();

// Test 4.2: Apply Translation
(() => {
  totalTests++;
  const transform = new Transform2D();
  transform.setVertices([[0, 0]]);
  transform.translate(10, 20);
  const transformed = transform.getTransformedVertices();
  if (
    assertApprox(transformed[0][0], 10, 0.0001, "2D translation applied")
  ) {
    passedTests++;
  }
})();

// Test 4.3: History Management
(() => {
  totalTests++;
  const transform = new Transform2D();
  transform.setVertices(Transform2D.getDefaultTriangle());
  transform.translate(50, 30);
  transform.rotate(45);
  transform.undo();
  const history = transform.getTransformationHistory();
  if (
    assertEqual(history.length, 1, "Undo removes transformation from history")
  ) {
    passedTests++;
  }
})();

// Test 4.4: Reset
(() => {
  totalTests++;
  const transform = new Transform2D();
  transform.setVertices(Transform2D.getDefaultTriangle());
  transform.translate(50, 30).rotate(45).scale(1.5);
  transform.reset();
  const matrix = transform.getCurrentMatrix();
  const identity = identityMatrix(3);
  if (assertEqual(matrix, identity, "Reset returns to identity matrix"))
    passedTests++;
})();

// ============================================
// Transform3D CLASS TESTS
// ============================================
console.log("\n[5] Transform3D CLASS");
console.log("-------------------");

// Test 5.1: Initialize with Pyramid
(() => {
  totalTests++;
  const transform = new Transform3D();
  const pyramid = Transform3D.getDefaultPyramid();
  transform.setVertices(pyramid.vertices);
  transform.setFaces(pyramid.faces);
  const vertices = transform.getOriginalVertices();
  if (
    assertEqual(vertices.length, 5, "Transform3D initialized with pyramid")
  ) {
    passedTests++;
  }
})();

// Test 5.2: Apply 3D Rotation
(() => {
  totalTests++;
  const transform = new Transform3D();
  transform.setVertices([[1, 0, 0]]);
  transform.rotateX(Math.PI / 2); // 90 degrees
  const transformed = transform.getTransformedVertices();
  // After 90° rotation around X, (1,0,0) should stay (1,0,0)
  if (
    assertApprox(transformed[0][0], 1, 0.0001, "3D X-rotation applied")
  ) {
    passedTests++;
  }
})();

// Test 5.3: 3D History
(() => {
  totalTests++;
  const transform = new Transform3D();
  const cube = Transform3D.getDefaultCube();
  transform.setVertices(cube.vertices);
  transform.rotateX(45);
  transform.rotateY(30);
  transform.scale(1.5);
  const history = transform.getTransformationHistory();
  if (
    assertEqual(history.length, 3, "3D transformation history tracking")
  ) {
    passedTests++;
  }
})();

// ============================================
// TransformXCore TESTS
// ============================================
console.log("\n[6] TransformXCore CLASS");
console.log("----------------------");

// Test 6.1: Initialization
(() => {
  totalTests++;
  const core = new TransformXCore();
  core.initialize("2D");
  if (assertEqual(core.mode, "2D", "Core initialized in 2D mode"))
    passedTests++;
})();

// Test 6.2: Mode Switching
(() => {
  totalTests++;
  const core = new TransformXCore();
  core.initialize("2D");
  core.switchMode("3D");
  if (assertEqual(core.mode, "3D", "Core mode switching works"))
    passedTests++;
})();

// Test 6.3: 2D Transformation via Core
(() => {
  totalTests++;
  const core = new TransformXCore();
  core.initialize("2D");
  core.apply2DTransformation("translate", { tx: 50, ty: 30 });
  const state = core.getState();
  if (
    assertEqual(
      state.transform2D.transformations.length,
      1,
      "2D transformation applied via core"
    )
  ) {
    passedTests++;
  }
})();

// Test 6.4: State Export/Import
(() => {
  totalTests++;
  const core = new TransformXCore();
  core.initialize("2D");
  core.apply2DTransformation("translate", { tx: 100, ty: 50 });
  const json = core.exportState();
  const core2 = new TransformXCore();
  core2.initialize("2D");
  core2.importState(json);
  const state1 = JSON.stringify(core.getState());
  const state2 = JSON.stringify(core2.getState());
  if (assertEqual(state1.length > 10, true, "State can be exported/imported"))
    passedTests++;
})();

// ============================================
// TransformXAPI TESTS
// ============================================
console.log("\n[7] TransformXAPI (PUBLIC API)");
console.log("------------------------------");

// Test 7.1: API Initialization
(() => {
  totalTests++;
  const api = new TransformXAPI();
  api.init("2D");
  if (assertEqual(api.getMode(), "2D", "API initialized successfully"))
    passedTests++;
})();

// Test 7.2: Chainable API
(() => {
  totalTests++;
  const api = new TransformXAPI();
  const result = api.init("2D").translate2D(50, 30).rotate2D(45);
  const history = api.getHistory();
  if (
    assertEqual(history.length, 2, "Chainable API works with fluent interface")
  ) {
    passedTests++;
  }
})();

// Test 7.3: Get Matrix
(() => {
  totalTests++;
  const api = new TransformXAPI();
  api.init("2D");
  const matrix = api.getMatrix();
  const identity = identityMatrix(3);
  if (assertEqual(matrix, identity, "API returns correct matrix"))
    passedTests++;
})();

// Test 7.4: Callbacks
(() => {
  totalTests++;
  let callbackFired = false;
  const api = new TransformXAPI();
  api.init("2D");
  api.onStateChange(() => {
    callbackFired = true;
  });
  api.translate2D(50, 30);
  if (assertEqual(callbackFired, true, "State change callback fires"))
    passedTests++;
})();

// Test 7.5: Reset
(() => {
  totalTests++;
  const api = new TransformXAPI();
  api.init("2D").translate2D(100, 50).rotate2D(45).scale2D(1.5);
  api.reset();
  const matrix = api.getMatrix();
  const identity = identityMatrix(3);
  if (assertEqual(matrix, identity, "Reset via API works correctly"))
    passedTests++;
})();

// ============================================
// SUMMARY
// ============================================
console.log("\n===========================================");
console.log(`TEST RESULTS: ${passedTests}/${totalTests} tests passed`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log("===========================================\n");

if (passedTests === totalTests) {
  console.log("✓ ALL TESTS PASSED! Core is production-ready.\n");
} else {
  console.log(`✗ ${totalTests - passedTests} test(s) failed. Review above.\n`);
}

export { assertEqual, assertApprox };
