# TransformX: Interactive 2D & 3D Transformation Visualizer

**Backend & Core Engine** - Production-quality transformation mathematics and state management system.

## Overview

TransformX is a sophisticated computational geometry engine that provides complete 2D and 3D transformation capabilities using matrix mathematics. This backend/core module handles all mathematical operations, state management, animation, and transformation history.

**Version:** 1.0.0  
**Status:** Production Ready

---

## Project Structure

```
src/
├── core/                          # Core application engine
│   ├── TransformXCore.js         # Main orchestrator
│   ├── TransformXAPI.js          # Public API interface
│   ├── AnimationManager.js       # Animation & transition management
│   ├── HistoryManager.js         # Undo/redo and transformation tracking
│   └── config.js                 # Configuration and constants
├── 2d/                            # 2D transformation engine
│   └── Transform2D.js            # 2D transformation class
├── 3d/                            # 3D transformation engine
│   └── Transform3D.js            # 3D transformation class
└── utils/                         # Utility functions
    ├── matrix.js                 # Matrix operations
    └── helpers.js                # Helper functions
```

---

## Core Features

### 1. **Matrix Operations** (`src/utils/matrix.js`)

Complete matrix mathematics implementation:

- **2D Transformations (3×3 homogeneous matrices)**
  - Translation: `generate2DTranslationMatrix(tx, ty)`
  - Rotation: `generate2DRotationMatrix(angle, pivot)`
  - Scaling: `generate2DScalingMatrix(sx, sy, pivot)`
  - Reflection: `generate2DReflectionMatrix(axis)`, `generate2DReflectionLineMatrix(angle, point)`
  - Shearing: `generate2DShearingMatrix(shx, shy)`

- **3D Transformations (4×4 homogeneous matrices)**
  - Translation: `generate3DTranslationMatrix(tx, ty, tz)`
  - Rotation: `generate3DRotationMatrixX/Y/Z(angle)`
  - Scaling: `generate3DScalingMatrix(sx, sy, sz)`

- **Core Math Functions**
  - `multiplyMatrices(matA, matB)` - Matrix multiplication
  - `applyTransformation(point, matrix)` - Apply transformation to point
  - `identityMatrix(size)` - Create identity matrix
  - `copyMatrix(matrix)` - Deep copy matrix

### 2. **2D Transformation Engine** (`src/2d/Transform2D.js`)

`Transform2D` class handles all 2D operations:

```javascript
const transform = new Transform2D();

// Set polygon vertices
transform.setVertices([[100, 50], [200, 150], [50, 150]]);

// Apply transformations
transform.translate(50, 30);
transform.rotate(45);  // degrees
transform.scale(1.5, 2);
transform.reflect('x');
transform.shear(0.3, 0);

// Get results
const original = transform.getOriginalVertices();
const transformed = transform.getTransformedVertices();
const matrix = transform.getCurrentMatrix();

// History management
transform.undo();
transform.redo();
transform.reset();
```

**Key Methods:**
- `setVertices(vertices)` - Initialize polygon
- `translate(tx, ty)` - Translate shape
- `rotate(angle, pivot)` - Rotate (degrees, optional pivot)
- `scale(sx, sy, pivot)` - Scale (uniform or non-uniform)
- `reflect(axis)` - Reflect ('x', 'y', or 'xy')
- `reflectLine(angle, point)` - Reflect about arbitrary line
- `shear(shx, shy)` - Shear transformation
- `getTransformedVertices()` - Get transformed coordinates
- `getCurrentMatrix()` - Get current 3×3 matrix
- `getTransformationHistory()` - Get all transformation steps
- `undo()` / `redo()` / `reset()` - History operations

### 3. **3D Transformation Engine** (`src/3d/Transform3D.js`)

`Transform3D` class handles all 3D operations:

```javascript
const transform = new Transform3D();

// Initialize with default cube or pyramid
const cube = Transform3D.getDefaultCube();
transform.setVertices(cube.vertices);
transform.setFaces(cube.faces);

// Apply 3D transformations
transform.translate(50, 0, 50);
transform.rotateX(45);  // degrees around X axis
transform.rotateY(30);  // degrees around Y axis
transform.rotateZ(20);  // degrees around Z axis
transform.rotateEuler(45, 30, 20);  // Combined rotation
transform.scale(1.2, 1.5, 1.2);

// Get results
const transformed = transform.getTransformedVertices();
const faces = transform.getFaces();
const matrix = transform.getCurrentMatrix();
```

**Key Methods:**
- `setVertices(vertices)` - Set 3D vertices
- `setFaces(faces)` - Set face definitions
- `translate(tx, ty, tz)` - Translate in 3D
- `rotateX/Y/Z(angle)` - Rotate around individual axes
- `rotateEuler(angleX, angleY, angleZ)` - Combined rotation
- `scale(sx, sy, sz)` - Scale in 3D
- `getTransformedVertices()` - Get transformed coordinates
- `getCurrentMatrix()` - Get current 4×4 matrix
- `undo()` / `redo()` / `reset()` - History operations

### 4. **Core Application Engine** (`src/core/TransformXCore.js`)

`TransformXCore` orchestrates all functionality:

```javascript
const app = new TransformXCore();
app.initialize('2D');  // Start in 2D mode

// Apply transformations
app.apply2DTransformation('translate', { tx: 100, ty: 50 });
app.apply3DTransformation('rotateY', { angle: 45 });

// Switch modes
app.switchMode('3D');
app.switchMode('2D');

// Get state
const state = app.getState();
const history = app.getTransformationHistory();

// Undo/Redo
app.undo();
app.redo();
app.reset();

// Update loop
app.update();  // Call from animation loop
```

### 5. **Public API** (`src/core/TransformXAPI.js`)

Clean, chainable API for frontend integration:

```javascript
import TransformXAPI from './src/core/TransformXAPI.js';

const api = new TransformXAPI();

api
  .init('2D')
  .translate2D(100, 50)
  .rotate2D(45)
  .scale2D(1.5, 1.5)
  .animate2DRotate(360, 4000)
  .onStateChange((state) => {
    console.log('State changed:', state);
  });

// Get data for rendering
const vertices = api.getVertices();
const matrix = api.getMatrix();
```

### 6. **Animation Manager** (`src/core/AnimationManager.js`)

`AnimationManager` handles transformation animations:

```javascript
const animator = new AnimationManager();

animator.start(
  'rotate',
  { angle: 360 },
  3000,  // duration ms
  (state) => console.log(state.progress),
  (state) => console.log('Complete')
);

// In animation loop:
animator.update();  // Returns { progress, isComplete, ... }
```

**Features:**
- Easing functions (linear, easeIn, easeOut, easeInOut, elastic, bounce)
- Customizable duration and parameters
- Progress tracking and callbacks
- State interpolation

### 7. **History Management** (`src/core/HistoryManager.js`)

`HistoryManager` handles undo/redo operations:

```javascript
const history = new HistoryManager();

history.pushState(state, "Translate operation");
history.undo();
history.redo();

console.log(history.canUndo());  // true/false
console.log(history.canRedo());  // true/false
```

**Additional Classes:**
- `TransformationPipeline` - Sequential transformation steps
- `TransformationBatch` - Batch operations with async execution

### 8. **Helper Utilities** (`src/utils/helpers.js`)

Comprehensive utility functions:

```javascript
import {
  degreesToRadians,
  calculateCentroid2D,
  calculateCentroid3D,
  calculateBoundingBox2D,
  calculateBoundingBox3D,
  calculateArea2D,
  calculatePerimeter2D,
  distance2D,
  distance3D,
  generateRegularPolygon,
  generateCircleVertices,
  normalizeVector,
  dotProduct,
  crossProduct,
} from './src/utils/helpers.js';
```

---

## Usage Examples

### Basic 2D Transformation

```javascript
import TransformXAPI from './src/core/TransformXAPI.js';

const api = new TransformXAPI();
api.init('2D');

// Apply sequence of transformations
api
  .translate2D(100, 50)
  .rotate2D(45)
  .scale2D(1.2, 1.2);

// Get transformed vertices for rendering
const vertices = api.getVertices();
const matrix = api.getMatrix();

// Undo
api.undo();

// Export state
const json = api.exportState();
```

### 3D Transformations

```javascript
const api = new TransformXAPI();
api.init('3D');

api
  .rotateEuler(45, 30, 20)
  .scale3D(1.5, 1.5, 1.5)
  .translate3D(100, 0, 50);

const vertices = api.getVertices();
const faces = api.getFaces();
```

### Animation Loop

```javascript
const api = new TransformXAPI();
api.init('2D');

// Register callbacks
api.onStateChange((state) => {
  console.log('State updated');
});

api.onFrame((state) => {
  // Called every frame
  console.log(state);
});

// Start animation
api.animate2DRotate(360, 4000);

// Animation loop
function loop() {
  api.update();
  requestAnimationFrame(loop);
}
loop();
```

### State Management

```javascript
const api = new TransformXAPI();
api.init('2D');

// Get complete state
const state = api.getState();
console.log(state);
/*
{
  mode: '2D',
  timestamp: 1234567890,
  frameCount: 150,
  transform2D: {
    vertices: [...],
    currentMatrix: [...],
    transformedVertices: [...],
    transformations: [...]
  },
  animation: { isAnimating: false, ... },
  history: { ... }
}
*/

// Export and import
const json = api.exportState();
localStorage.setItem('app-state', json);

// Later...
api.importState(localStorage.getItem('app-state'));
```

### Batch Operations

```javascript
const api = new TransformXAPI();
api.init('2D');

const batch = api.batch();
batch.add('translate', { tx: 100, ty: 50 });
batch.add('rotate', { angle: 45 });
batch.add('scale', { sx: 1.5, sy: 1.5 });

batch.execute();
```

---

## Configuration

Edit `src/core/config.js` to customize:

```javascript
CONFIG: {
  APP_NAME: "TransformX",
  DEBUG_MODE: false,
  
  // Canvas settings
  CANVAS_2D: {
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    BACKGROUND_COLOR: "#ffffff",
    GRID_SIZE: 50,
  },
  
  // Colors
  COLORS_2D: {
    ORIGINAL_SHAPE: "#3498db",
    TRANSFORMED_SHAPE: "#e74c3c",
    // ...
  },
  
  // Transformation limits
  TRANSFORM_LIMITS: {
    SCALE_MIN: 0.1,
    SCALE_MAX: 10,
  },
}
```

---

## Data Structures

### 2D Vertex
```javascript
[x: number, y: number]
```

### 3D Vertex
```javascript
[x: number, y: number, z: number]
```

### 2D Matrix (3×3)
```javascript
[
  [a, b, tx],
  [c, d, ty],
  [0, 0, 1 ]
]
```

### 3D Matrix (4×4)
```javascript
[
  [a, b, c, tx],
  [d, e, f, ty],
  [g, h, i, tz],
  [0, 0, 0, 1 ]
]
```

### State Object
```javascript
{
  mode: '2D' | '3D',
  timestamp: number,
  frameCount: number,
  transform2D: { vertices, currentMatrix, transformedVertices, ... },
  transform3D: { vertices, currentMatrix, transformedVertices, faces, ... },
  animation: { isAnimating, progress, ... },
  history: { undoCount, redoCount, ... },
  pipeline: { totalSteps, ... }
}
```

---

## Mathematical Background

### Homogeneous Coordinates

- **2D:** Point (x, y) → [x, y, 1]
- **3D:** Point (x, y, z) → [x, y, z, 1]

This allows translation to be expressed as matrix multiplication.

### Transformation Composition

Transformations are composed right-to-left:

```
Combined = T3 × T2 × T1
```

Applied to point: `result = Combined × point`

### Pivot Point Transformations

Rotate/scale about pivot (px, py):

```
T(px, py) × R(θ) × T(-px, -py)
```

---

## Performance Considerations

1. **Matrix Operations:** O(n³) for n×n multiplication
2. **Vertex Transformation:** O(n) for n vertices
3. **History Storage:** Memory efficient with deep copy on push
4. **Animation:** Uses requestAnimationFrame for smooth 60 FPS
5. **Undo/Redo:** Limited to configurable max steps (default: 50)

---

## Frontend Integration

This core engine is designed for easy integration with any frontend framework:

### React Example
```javascript
const [state, setState] = useState(null);
const apiRef = useRef(new TransformXAPI());

useEffect(() => {
  apiRef.current
    .init('2D')
    .onStateChange(setState);
}, []);

// Use in JSX
const vertices = apiRef.current.getVertices();
```

### Vue Example
```javascript
const api = new TransformXAPI();
api.init('2D');
api.onStateChange((newState) => {
  state.value = newState;
});
```

### Vanilla JS Example
```javascript
const api = new TransformXAPI();
api.init('2D');

api.onStateChange((newState) => {
  updateCanvas(newState);
});

function animationLoop() {
  api.update();
  requestAnimationFrame(animationLoop);
}
animationLoop();
```

---

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 10+
- Edge 15+
- ES6 modules required

---

## API Reference

See complete API documentation in individual files:

- `src/core/TransformXAPI.js` - Public API methods
- `src/utils/matrix.js` - Matrix operations
- `src/utils/helpers.js` - Utility functions
- `src/2d/Transform2D.js` - 2D engine
- `src/3d/Transform3D.js` - 3D engine

---

## Testing

All modules are pure functions with no side effects. Test any transformation with:

```javascript
import { multiplyMatrices } from './src/utils/matrix.js';

const mat1 = [[1, 0, 10], [0, 1, 20], [0, 0, 1]];
const mat2 = [[1, 0, 5], [0, 1, 10], [0, 0, 1]];

const result = multiplyMatrices(mat1, mat2);
console.log(result);  // Composed transformation
```

---

## License

MIT - Ready for production use

---

## Author

TransformX Development Team

**Version:** 1.0.0  
**Last Updated:** 2025-05-01
