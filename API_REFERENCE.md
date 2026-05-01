# TransformX Core - Complete API Reference

## Table of Contents

1. [TransformXAPI (Main API)](#transformxapi)
2. [TransformXCore (Engine)](#transformxcore)
3. [Transform2D (2D Engine)](#transform2d)
4. [Transform3D (3D Engine)](#transform3d)
5. [Matrix Utilities](#matrix-utilities)
6. [Helper Utilities](#helper-utilities)
7. [AnimationManager](#animationmanager)
8. [HistoryManager](#historymanager)

---

## TransformXAPI

**Main public API - Use this for frontend integration**

### Constructor
```javascript
const api = new TransformXAPI();
```

### Initialization
```javascript
api.init(mode: '2D' | '3D'): TransformXAPI
api.use2D(): TransformXAPI
api.use3D(): TransformXAPI
api.getMode(): '2D' | '3D'
```

### 2D Transformations
```javascript
// Applied to current shape
api.apply2D(operation: string, params: object): TransformXAPI
api.translate2D(tx: number, ty: number): TransformXAPI
api.rotate2D(angle: number, pivot?: [x, y]): TransformXAPI
api.scale2D(sx: number, sy?: number, pivot?: [x, y]): TransformXAPI
api.reflect2D(axis: 'x' | 'y' | 'xy'): TransformXAPI
api.shear2D(shx: number, shy: number): TransformXAPI
```

### 3D Transformations
```javascript
api.apply3D(operation: string, params: object): TransformXAPI
api.translate3D(tx: number, ty: number, tz: number): TransformXAPI
api.rotateX(angle: number): TransformXAPI
api.rotateY(angle: number): TransformXAPI
api.rotateZ(angle: number): TransformXAPI
api.rotateEuler(angleX: number, angleY: number, angleZ: number): TransformXAPI
api.scale3D(sx: number, sy?: number, sz?: number): TransformXAPI
```

### Animation
```javascript
api.animate(mode: string, params: object, duration?: number): TransformXAPI
api.animate2DRotate(angle?: 360, duration?: 4000): TransformXAPI
api.animate2DScale(sx?: 2, sy?: 2, duration?: 3000): TransformXAPI
api.animate3DRotate(angleX?: 360, angleY?: 360, angleZ?: 0, duration?: 5000): TransformXAPI
api.stopAnimation(): TransformXAPI
```

### History Management
```javascript
api.undo(): TransformXAPI
api.redo(): TransformXAPI
api.reset(): TransformXAPI
api.getHistory(): object[]
```

### State Management
```javascript
api.getState(): StateObject
api.getMatrix(): number[][]
api.getMatrixString(): string
api.getVertices(): number[][] (transformed)
api.getOriginalVertices(): number[][]
api.getFaces(): number[][] (3D only)
api.exportState(): string (JSON)
api.importState(json: string): boolean
```

### Callbacks
```javascript
api.onStateChange(callback: (state) => void): TransformXAPI
api.onFrame(callback: (state) => void): TransformXAPI
api.onAnimationComplete(callback: (state) => void): TransformXAPI
```

### Control
```javascript
api.update(): TransformXAPI
api.start(): TransformXAPI
api.stop(): TransformXAPI
api.getConfig(): CONFIG object
api.getPresets(): { transformations, animations }
```

---

## TransformXCore

**Low-level engine orchestrator**

### Constructor
```javascript
const core = new TransformXCore();
```

### Initialization
```javascript
core.initialize(defaultMode?: '2D' | '3D'): void
core.switchMode(newMode: '2D' | '3D'): void
```

### Properties
```javascript
core.mode: '2D' | '3D'
core.isRunning: boolean
core.frameCount: number
core.deltaTime: number
core.transform2D: Transform2D instance
core.transform3D: Transform3D instance
core.animationManager: AnimationManager instance
core.historyManager: HistoryManager instance
```

### 2D Operations
```javascript
core.apply2DTransformation(operation: string, params: object): void
```

Supported operations:
- `'translate'` - { tx, ty }
- `'rotate'` - { angle, pivot }
- `'scale'` - { sx, sy, pivot }
- `'reflect'` - { axis }
- `'reflectLine'` - { angle, point }
- `'shear'` - { shx, shy }

### 3D Operations
```javascript
core.apply3DTransformation(operation: string, params: object): void
```

Supported operations:
- `'translate'` - { tx, ty, tz }
- `'rotateX'` - { angle }
- `'rotateY'` - { angle }
- `'rotateZ'` - { angle }
- `'rotateEuler'` - { angleX, angleY, angleZ }
- `'scale'` - { sx, sy, sz }

### Animation
```javascript
core.startAnimation(mode: string, params?: object, duration?: 3000): void
```

### History
```javascript
core.undo(): void
core.redo(): void
core.reset(): void
core.getTransformationHistory(): object[]
```

### State
```javascript
core.getState(): StateObject
core.getCurrentMatrix(): number[][]
core.get2DVertices(): number[][]
core.get2DTransformedVertices(): number[][]
core.get3DVertices(): number[][]
core.get3DTransformedVertices(): number[][]
core.get3DFaces(): number[][]
core.exportState(): string
core.importState(json: string): boolean
```

### Callbacks
```javascript
core.onStateChange(callback: (state) => void): void
core.onFrame(callback: (state) => void): void
core.onAnimationComplete(callback: (state) => void): void
```

### Control
```javascript
core.update(): void
core.stop(): void
core.resume(): void
```

---

## Transform2D

**2D transformation engine**

### Constructor
```javascript
const transform = new Transform2D();
```

### Static Methods
```javascript
Transform2D.getDefaultTriangle(): number[][]
Transform2D.getDefaultRectangle(): number[][]
```

### Polygon Management
```javascript
transform.setVertices(vertices: number[][]): void
transform.addVertex(x: number, y: number): void
transform.clearVertices(): void
transform.getOriginalVertices(): number[][]
```

### Transformations
```javascript
transform.translate(tx: number, ty: number): void
transform.rotate(angle: number, pivot?: [x, y]): void
transform.scale(sx: number, sy?: number, pivot?: [x, y]): void
transform.reflect(axis?: 'x' | 'y' | 'xy'): void
transform.reflectLine(angle: number, point?: [x, y]): void
transform.shear(shx?: number, shy?: number): void
```

### Results
```javascript
transform.getTransformedVertices(): number[][]
transform.getCurrentMatrix(): number[][]
```

### History
```javascript
transform.undo(): void
transform.redo(): void
transform.reset(): void
transform.getTransformationHistory(): object[]
```

### Advanced
```javascript
transform.applyMatrix(matrix: number[][], name?: string): void
transform.applyComposite(operations: object[]): void
transform.getState(): StateObject
transform.setState(state: StateObject): void
```

---

## Transform3D

**3D transformation engine**

### Constructor
```javascript
const transform = new Transform3D();
```

### Static Methods
```javascript
Transform3D.getDefaultCube(): { vertices, faces }
Transform3D.getDefaultPyramid(): { vertices, faces }
```

### Object Management
```javascript
transform.setVertices(vertices: number[][]): void
transform.setFaces(faces: number[][]): void
transform.getOriginalVertices(): number[][]
transform.getFaces(): number[][]
```

### Transformations
```javascript
transform.translate(tx: number, ty: number, tz: number): void
transform.rotateX(angle: number): void
transform.rotateY(angle: number): void
transform.rotateZ(angle: number): void
transform.rotateEuler(angleX: number, angleY: number, angleZ: number): void
transform.scale(sx: number, sy?: number, sz?: number): void
```

### Results
```javascript
transform.getTransformedVertices(): number[][]
transform.getCurrentMatrix(): number[][]
```

### History
```javascript
transform.undo(): void
transform.redo(): void
transform.reset(): void
transform.getTransformationHistory(): object[]
```

### Advanced
```javascript
transform.applyMatrix(matrix: number[][], name?: string): void
transform.getState(): StateObject
transform.setState(state: StateObject): void
```

---

## Matrix Utilities

**src/utils/matrix.js**

### Core Operations
```javascript
import {
  multiplyMatrices(matA: number[][], matB: number[][]): number[][],
  applyTransformation(point: number[], matrix: number[][]): number[],
  identityMatrix(size: number): number[][],
  copyMatrix(matrix: number[][]): number[][],
  formatMatrix(matrix: number[][], precision?: 2): string,
  homogenousTo2D(point: number[]): number[],
  homogenousTo3D(point: number[]): number[]
} from './src/utils/matrix.js';
```

### 2D Transformation Generators
```javascript
generate2DTranslationMatrix(tx, ty): number[][]
generate2DRotationMatrix(angle, pivot?): number[][]
generate2DScalingMatrix(sx, sy, pivot?): number[][]
generate2DReflectionMatrix(axis?): number[][]
generate2DReflectionLineMatrix(angle, point?): number[][]
generate2DShearingMatrix(shx, shy): number[][]
```

### 3D Transformation Generators
```javascript
generate3DTranslationMatrix(tx, ty, tz): number[][]
generate3DRotationMatrixX(angle): number[][]
generate3DRotationMatrixY(angle): number[][]
generate3DRotationMatrixZ(angle): number[][]
generate3DScalingMatrix(sx, sy, sz): number[][]
```

---

## Helper Utilities

**src/utils/helpers.js**

### Angle Conversion
```javascript
degreesToRadians(degrees: number): number
radiansToDegrees(radians: number): number
```

### Math Operations
```javascript
clamp(value: number, min: number, max: number): number
lerp(a: number, b: number, t: number): number
distance2D(p1: number[], p2: number[]): number
distance3D(p1: number[], p2: number[]): number
```

### Geometry
```javascript
calculateCentroid2D(vertices: number[][]): number[]
calculateCentroid3D(vertices: number[][]): number[]
calculateBoundingBox2D(vertices: number[][]): BoundingBox2D
calculateBoundingBox3D(vertices: number[][]): BoundingBox3D
calculateArea2D(vertices: number[][]): number
calculatePerimeter2D(vertices: number[][]): number
pointInPolygon(point: number[], polygon: number[][]): boolean
```

### Vector Operations
```javascript
normalizeVector(vector: number[]): number[]
dotProduct(a: number[], b: number[]): number
crossProduct(a: number[], b: number[]): number[]
```

### Shape Generation
```javascript
generateRegularPolygon(sides: number, radius: number, centerX?: 0, centerY?: 0): number[][]
generateCircleVertices(radius: number, segments?: 32, centerX?: 0, centerY?: 0): number[][]
generateGrid(width, height, stepX, stepY, offsetX?, offsetY?): number[][][]
```

### Utility
```javascript
formatNumber(value: number, decimals?: 2): number
deepCopy(obj: any): any
throttle(func: function, delay: number): function
debounce(func: function, delay: number): function
createAnimationLoop(callback: function): { start(), stop(), isRunning() }
```

---

## AnimationManager

**src/core/AnimationManager.js**

### Constructor
```javascript
const animator = new AnimationManager();
```

### Methods
```javascript
animator.start(
  mode: string,
  parameters?: object,
  duration?: 3000,
  onFrame?: (state) => void,
  onComplete?: (state) => void
): void

animator.stop(): void
animator.update(): AnimationState
animator.getEasedProgress(easing?: string): number
animator.getInterpolatedParameters(easing?: string): object
animator.getState(): AnimationState
```

### Easing Functions
```javascript
'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 
'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' |
'elastic' | 'bounce'
```

---

## HistoryManager

**src/core/HistoryManager.js**

### Constructor
```javascript
const history = new HistoryManager(maxSize?: 100);
```

### Methods
```javascript
history.pushState(state: object, description?: string): void
history.undo(): object | null
history.redo(): object | null
history.canUndo(): boolean
history.canRedo(): boolean
history.getCurrentState(): object | null
history.getHistory(): HistoryEntry[]
history.clear(): void
history.getState(): HistoryState
```

### TransformationPipeline
```javascript
const pipeline = new TransformationPipeline();

pipeline.addStep(name: string, operation: function, parameters?: object): void
pipeline.execute(initialState: object): object[]
pipeline.getStepResult(stepIndex: number): object | null
pipeline.getAllResults(): object[]
pipeline.clear(): void
pipeline.getState(): object
```

### TransformationBatch
```javascript
const batch = new TransformationBatch();

batch.add(transform: object): void
batch.executeBatch(callback?: function): Promise<object[]>
batch.getStatus(): object
batch.clear(): void
batch.getState(): object
```

---

## Data Structures

### StateObject
```javascript
{
  mode: '2D' | '3D',
  timestamp: number,
  frameCount: number,
  transform2D?: {
    vertices: number[][],
    currentMatrix: number[][],
    transformedVertices: number[][],
    transformations: object[],
    historyIndex: number,
    historyLength: number
  },
  transform3D?: {
    vertices: number[][],
    faces: number[][],
    currentMatrix: number[][],
    transformedVertices: number[][],
    transformations: object[],
    historyIndex: number,
    historyLength: number
  },
  animation: {
    isAnimating: boolean,
    progress: number,
    mode: string | null,
    parameters: object,
    duration: number
  },
  history: {
    undoCount: number,
    redoCount: number,
    canUndo: boolean,
    canRedo: boolean
  },
  pipeline: {
    totalSteps: number,
    resultsCount: number
  }
}
```

### BoundingBox2D
```javascript
{
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  width: number,
  height: number
}
```

### BoundingBox3D
```javascript
{
  minX: number, maxX: number,
  minY: number, maxY: number,
  minZ: number, maxZ: number,
  width: number,
  height: number,
  depth: number
}
```

### HistoryEntry
```javascript
{
  index: number,
  description: string,
  timestamp: number
}
```

### AnimationState
```javascript
{
  progress: number (0-1),
  isComplete: boolean,
  mode: string,
  parameters: object
}
```

---

## Configuration

**src/core/config.js**

```javascript
import { CONFIG, TRANSFORMATION_PRESETS, ANIMATION_PRESETS } from './src/core/config.js';
```

Key configuration objects:
- `CONFIG.CANVAS_2D` - Canvas settings
- `CONFIG.COLORS_2D` - Color definitions
- `CONFIG.CANVAS_3D` - 3D settings
- `CONFIG.TRANSFORM_LIMITS` - Constraints
- `CONFIG.ANIMATION` - Animation defaults
- `CONFIG.HISTORY` - History settings
- `CONFIG.MATRIX` - Matrix display
- `CONFIG.EXPORT` - Export settings

---

## Type Hints

```typescript
// Vertices
type Vertex2D = [x: number, y: number];
type Vertex3D = [x: number, y: number, z: number];

// Matrices
type Matrix2D = number[][];  // 3x3
type Matrix3D = number[][];  // 4x4

// Pivot/Points
type Point2D = [x: number, y: number];
type Point3D = [x: number, y: number, z: number];

// Face definitions (indices into vertex array)
type Face = number[];

// Transformation result
type TransformationResult = {
  name: string,
  matrix: Matrix2D | Matrix3D,
  parameters?: object
};
```

---

## Version & Support

**TransformX Core v1.0.0**

- Production ready
- No external dependencies
- ES6 modules
- Browser & Node.js compatible
- MIT License

---

**Last Updated:** 2025-05-01
