/**
 * TransformX Core - Usage Examples
 * Demonstrates all major features of the backend engine
 */

import TransformXAPI from "./src/core/TransformXAPI.js";

console.log("===========================================");
console.log("TransformX Core Engine - Examples");
console.log("===========================================\n");

// ============================================
// EXAMPLE 1: Basic 2D Transformation
// ============================================
console.log("EXAMPLE 1: Basic 2D Transformation");
console.log("-----------------------------------");

const api2D = new TransformXAPI();
api2D.init("2D");

console.log("Initial vertices:", api2D.getOriginalVertices());
console.log("Initial matrix:", api2D.getMatrix());

api2D.translate2D(100, 50);
console.log("\nAfter translate(100, 50):");
console.log("Transformed vertices:", api2D.getVertices());

api2D.rotate2D(45);
console.log("\nAfter rotate(45°):");
console.log("Transformed vertices:", api2D.getVertices());

api2D.scale2D(1.5);
console.log("\nAfter scale(1.5):");
console.log("Transformed vertices:", api2D.getVertices());
console.log("\nCurrent matrix:");
console.log(api2D.getMatrixString());

// ============================================
// EXAMPLE 2: Transformation History
// ============================================
console.log("\n\nEXAMPLE 2: Transformation History");
console.log("----------------------------------");

const apiHistory = new TransformXAPI();
apiHistory.init("2D");

apiHistory
  .translate2D(50, 30)
  .rotate2D(30)
  .scale2D(1.2, 0.8);

console.log("Transformation history:");
apiHistory.getHistory().forEach((t) => {
  console.log(`  Step ${t.step}: ${t.name}`);
});

console.log("\nBefore undo - vertices:", apiHistory.getVertices());
apiHistory.undo();
console.log("After undo - vertices:", apiHistory.getVertices());

apiHistory.redo();
console.log("After redo - vertices:", apiHistory.getVertices());

// ============================================
// EXAMPLE 3: 3D Transformation
// ============================================
console.log("\n\nEXAMPLE 3: 3D Transformation");
console.log("----------------------------");

const api3D = new TransformXAPI();
api3D.init("3D");

console.log("Initial 3D vertices (pyramid):");
api3D.getOriginalVertices().forEach((v, i) => {
  console.log(`  V${i}: [${v[0].toFixed(1)}, ${v[1].toFixed(1)}, ${v[2].toFixed(1)}]`);
});

api3D.rotateEuler(45, 30, 20);
console.log("\nAfter rotateEuler(45°, 30°, 20°):");
api3D.getVertices().forEach((v, i) => {
  console.log(
    `  V${i}: [${v[0].toFixed(1)}, ${v[1].toFixed(1)}, ${v[2].toFixed(1)}]`
  );
});

api3D.scale3D(1.5, 1.2, 0.8);
console.log("\nAfter scale(1.5, 1.2, 0.8):");
api3D.getVertices().forEach((v, i) => {
  console.log(
    `  V${i}: [${v[0].toFixed(1)}, ${v[1].toFixed(1)}, ${v[2].toFixed(1)}]`
  );
});

// ============================================
// EXAMPLE 4: Chaining Operations
// ============================================
console.log("\n\nEXAMPLE 4: Chaining Operations");
console.log("------------------------------");

const apiChain = new TransformXAPI();
apiChain
  .init("2D")
  .translate2D(100, 50)
  .rotate2D(45)
  .scale2D(1.5, 1.5)
  .translate2D(50, 50);

console.log("After chaining 4 operations:");
console.log("Vertices:", apiChain.getVertices());
console.log("History steps:", apiChain.getHistory().length);

// ============================================
// EXAMPLE 5: State Management
// ============================================
console.log("\n\nEXAMPLE 5: State Management");
console.log("---------------------------");

const apiState = new TransformXAPI();
apiState.init("2D").translate2D(50, 30).rotate2D(45);

console.log("Full application state:");
const state = apiState.getState();
console.log(`  Mode: ${state.mode}`);
console.log(`  Frame count: ${state.frameCount}`);
console.log(`  Transformation count: ${state.transform2D.transformations.length}`);
console.log(`  History entries: ${state.history.undoCount}`);

// Export and import
const exportedJSON = apiState.exportState();
console.log("\nExported state (JSON length):", exportedJSON.length, "bytes");

// Create new instance and import
const apiImport = new TransformXAPI();
apiImport.init("2D");
apiImport.importState(exportedJSON);
console.log("Imported state - vertices match:", 
  JSON.stringify(apiImport.getVertices()) === JSON.stringify(apiState.getVertices())
);

// ============================================
// EXAMPLE 6: Callbacks and Events
// ============================================
console.log("\n\nEXAMPLE 6: Callbacks and Events");
console.log("-------------------------------");

const apiCallback = new TransformXAPI();
let callbackCount = 0;

apiCallback
  .init("2D")
  .onStateChange((state) => {
    callbackCount++;
    console.log(`State changed (callback #${callbackCount})`);
  });

console.log("Applying transformations (should trigger callbacks):");
apiCallback.translate2D(100, 50);
apiCallback.rotate2D(45);
apiCallback.scale2D(1.5);

console.log(`Total callbacks triggered: ${callbackCount}`);

// ============================================
// EXAMPLE 7: Animation
// ============================================
console.log("\n\nEXAMPLE 7: Animation Setup");
console.log("--------------------------");

const apiAnim = new TransformXAPI();
apiAnim
  .init("3D")
  .onAnimationComplete((state) => {
    console.log("Animation completed!");
  });

console.log("Starting 3D rotation animation (360° on all axes, 5 seconds)");
apiAnim.animate3DRotate(360, 360, 0, 5000);
console.log("Animation started. Call api.update() in your animation loop.");

// ============================================
// EXAMPLE 8: Advanced - Batch Operations
// ============================================
console.log("\n\nEXAMPLE 8: Advanced Features");
console.log("----------------------------");

const apiAdvanced = new TransformXAPI();
apiAdvanced.init("2D");

console.log("Available presets:");
const presets = apiAdvanced.getPresets();
console.log("2D Transformations:", Object.keys(presets.transformations["2D"]));
console.log("2D Animations:", Object.keys(presets.animations["2D"]));
console.log("3D Animations:", Object.keys(presets.animations["3D"]));

// ============================================
// EXAMPLE 9: Mode Switching
// ============================================
console.log("\n\nEXAMPLE 9: Mode Switching");
console.log("-------------------------");

const apiMode = new TransformXAPI();
apiMode.init("2D");
console.log("Current mode:", apiMode.getMode());

apiMode.use3D();
console.log("Switched to:", apiMode.getMode());

apiMode.use2D();
console.log("Switched back to:", apiMode.getMode());

// ============================================
// EXAMPLE 10: Reset and Undo/Redo
// ============================================
console.log("\n\nEXAMPLE 10: Reset and Undo/Redo");
console.log("--------------------------------");

const apiReset = new TransformXAPI();
apiReset
  .init("2D")
  .translate2D(100, 50)
  .rotate2D(45)
  .scale2D(1.5);

console.log("After 3 transformations - vertex count:", 
  apiReset.getVertices().length
);

apiReset.reset();
console.log("After reset - matrix is identity:", 
  JSON.stringify(apiReset.getMatrix()) === JSON.stringify(apiReset.getOriginalVertices().map((v, i) => i === apiReset.getOriginalVertices().length ? 1 : v))
);

console.log("\n===========================================");
console.log("All examples completed successfully!");
console.log("===========================================");
