# TransformX Core - Quick Start Guide

## Overview

TransformX Core is a production-ready backend/core engine for 2D and 3D geometric transformations using matrix mathematics. It's designed to be integrated with any frontend framework or visualization library.

---

## Installation

### Option 1: Direct Use (ES6 Modules)
```javascript
import TransformXAPI from './src/core/TransformXAPI.js';

const api = new TransformXAPI();
api.init('2D');
```

### Option 2: Via Node.js
```bash
npm install transformx-core
```

```javascript
import TransformXAPI from 'transformx-core';
```

---

## 5-Minute Start

### 1. Initialize
```javascript
const api = new TransformXAPI();
api.init('2D');  // or '3D'
```

### 2. Apply Transformations
```javascript
api
  .translate2D(100, 50)
  .rotate2D(45)
  .scale2D(1.5);
```

### 3. Get Results
```javascript
const vertices = api.getVertices();  // Transformed coordinates
const matrix = api.getMatrix();       // Current transformation matrix
```

### 4. Undo/Redo
```javascript
api.undo();      // Undo last operation
api.redo();      // Redo
api.reset();     // Reset to initial state
```

### 5. Export State
```javascript
const json = api.exportState();
localStorage.setItem('state', json);

// Later...
api.importState(localStorage.getItem('state'));
```

---

## Common Patterns

### 2D Transformations
```javascript
const api = new TransformXAPI();
api.init('2D');

// Translation
api.translate2D(x, y);

// Rotation (in degrees)
api.rotate2D(angle, [pivotX, pivotY]);

// Scaling
api.scale2D(sx, sy, [pivotX, pivotY]);

// Reflection
api.reflect2D('x');    // x-axis
api.reflect2D('y');    // y-axis
api.reflect2D('xy');   // y=x diagonal

// Shearing
api.shear2D(shx, shy);
```

### 3D Transformations
```javascript
const api = new TransformXAPI();
api.init('3D');

// Individual rotations
api.rotateX(angleInDegrees);
api.rotateY(angleInDegrees);
api.rotateZ(angleInDegrees);

// Combined rotation
api.rotateEuler(angleX, angleY, angleZ);

// Translation
api.translate3D(tx, ty, tz);

// Scaling
api.scale3D(sx, sy, sz);
```

### Animation
```javascript
// Rotate continuously
api.animate2DRotate(360, 4000);  // 360° in 4 seconds

// Custom animation
api.animate('rotate', { angle: 180 }, 3000);

// Animation loop
function loop() {
  api.update();
  // Render using api.getVertices()
  requestAnimationFrame(loop);
}
loop();
```

### State Management
```javascript
// Get complete state
const state = api.getState();
console.log(state);
/*
{
  mode: '2D',
  transform2D: {
    vertices: [...],
    currentMatrix: [...],
    transformedVertices: [...],
    transformations: [...]
  },
  animation: {...},
  history: {...}
}
*/

// Get transformation history
const history = api.getHistory();
history.forEach(t => console.log(t.name));

// Get matrix
const matrix = api.getMatrix();
const matrixString = api.getMatrixString();  // Formatted output
```

### Callbacks
```javascript
api
  .onStateChange((state) => {
    console.log('State changed:', state);
    updateVisualization(state);
  })
  .onFrame((state) => {
    // Called every frame during animation
    render(state);
  })
  .onAnimationComplete((state) => {
    console.log('Animation done');
  });
```

---

## Integration Examples

### React
```javascript
import { useRef, useEffect, useState } from 'react';
import TransformXAPI from './src/core/TransformXAPI.js';

function TransformationViewer() {
  const apiRef = useRef(null);
  const [state, setState] = useState(null);

  useEffect(() => {
    apiRef.current = new TransformXAPI();
    apiRef.current
      .init('2D')
      .onStateChange(setState);
  }, []);

  const handleTransform = (operation) => {
    apiRef.current[operation]();
    setState(apiRef.current.getState());
  };

  return (
    <div>
      <button onClick={() => handleTransform('translate2D')}>
        Translate
      </button>
      {state && <canvas ref={drawCanvas} />}
    </div>
  );
}
```

### Vue
```javascript
import { ref, onMounted } from 'vue';
import TransformXAPI from './src/core/TransformXAPI.js';

export default {
  setup() {
    const api = ref(null);
    const state = ref(null);

    onMounted(() => {
      api.value = new TransformXAPI();
      api.value.init('2D');
      api.value.onStateChange((newState) => {
        state.value = newState;
      });
    });

    return { api, state };
  }
};
```

### Vanilla JS
```javascript
const api = new TransformXAPI();
api.init('2D');

api.onStateChange((state) => {
  updateCanvas(state);
});

document.getElementById('translate-btn').addEventListener('click', () => {
  api.translate2D(50, 50);
});

function animationLoop() {
  api.update();
  requestAnimationFrame(animationLoop);
}
animationLoop();
```

---

## API Quick Reference

### Initialization
| Method | Effect |
|--------|--------|
| `init(mode)` | Initialize with '2D' or '3D' |
| `use2D()` | Switch to 2D mode |
| `use3D()` | Switch to 3D mode |

### 2D Operations
| Method | Parameters |
|--------|-----------|
| `translate2D(tx, ty)` | Translate by (tx, ty) |
| `rotate2D(angle, pivot)` | Rotate in degrees |
| `scale2D(sx, sy, pivot)` | Scale non-uniformly |
| `reflect2D(axis)` | Reflect ('x', 'y', 'xy') |
| `shear2D(shx, shy)` | Shear transformation |

### 3D Operations
| Method | Parameters |
|--------|-----------|
| `translate3D(tx, ty, tz)` | Translate in 3D |
| `rotateX/Y/Z(angle)` | Rotate around axis |
| `rotateEuler(aX, aY, aZ)` | Combined rotation |
| `scale3D(sx, sy, sz)` | Scale in 3D |

### State & History
| Method | Returns |
|--------|---------|
| `getState()` | Full application state |
| `getMatrix()` | Current transformation matrix |
| `getVertices()` | Transformed vertices |
| `getOriginalVertices()` | Original vertices |
| `getHistory()` | Transformation steps |
| `undo()` | Undo last operation |
| `redo()` | Redo last undo |
| `reset()` | Reset to initial state |

### Animation
| Method | Effect |
|--------|--------|
| `animate(mode, params, duration)` | Start custom animation |
| `animate2DRotate(angle, duration)` | Animate 2D rotation |
| `animate3DRotate(aX, aY, aZ, duration)` | Animate 3D rotation |
| `stopAnimation()` | Stop current animation |
| `update()` | Update animation frame |

### Callbacks
| Method | Callback Parameter |
|--------|-------------------|
| `onStateChange(fn)` | state object |
| `onFrame(fn)` | state object |
| `onAnimationComplete(fn)` | animation state |

### Data Export
| Method | Returns |
|--------|---------|
| `exportState()` | JSON string |
| `importState(json)` | boolean success |

---

## Performance Tips

1. **Batch Operations**: Chain multiple transformations
   ```javascript
   api.translate2D(50, 50).rotate2D(45).scale2D(1.5);
   ```

2. **Reuse Objects**: Don't create new API instances repeatedly
   ```javascript
   // Good
   const api = new TransformXAPI();
   api.translate2D(...).rotate2D(...);

   // Avoid
   new TransformXAPI().translate2D(...);
   new TransformXAPI().rotate2D(...);
   ```

3. **Update Only When Needed**: Check if state actually changed
   ```javascript
   let lastState = null;
   api.onStateChange((state) => {
     if (JSON.stringify(state) !== JSON.stringify(lastState)) {
       render(state);
       lastState = state;
     }
   });
   ```

4. **Limit History Size**: Default is 50 steps
   ```javascript
   // Modify in src/core/config.js
   HISTORY: { MAX_UNDO_STEPS: 100 }
   ```

---

## Troubleshooting

### "Module not found" error
- Ensure all import paths are correct
- Use absolute paths from project root
- Check file extensions (.js required)

### Transformations not applying
- Ensure you call `api.update()` in animation loop
- Check that mode is correct (2D vs 3D)
- Verify `onStateChange` callback is registered

### State not updating in React
- Use `setState` or `useState` to trigger re-render
- Register callback with `onStateChange`

### Matrix values look wrong
- Use `getMatrixString()` for formatted output
- Check that transformations are in correct order
- Remember: operations are right-to-left in matrix math

---

## Examples

See `examples.js` for 10 complete working examples.

Run tests with:
```bash
node tests.js
```

---

## Documentation

- **Full API Docs**: See `README.md`
- **Matrix Math**: `src/utils/matrix.js`
- **2D Engine**: `src/2d/Transform2D.js`
- **3D Engine**: `src/3d/Transform3D.js`
- **Core Engine**: `src/core/TransformXCore.js`

---

## Version

**TransformX Core v1.0.0**
- Production Ready
- No external dependencies
- ES6 modules
- MIT License

---

**Ready to integrate with your frontend? Start building!** 🚀
