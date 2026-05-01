/**
 * Transformation History Manager
 * Handles undo/redo operations and transformation tracking
 */

export class HistoryManager {
  constructor(maxSize = 100) {
    this.undoStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.currentState = null;
  }

  /**
   * Push a state to history
   * @param {object} state - State object to save
   * @param {string} description - Description of the operation
   */
  pushState(state, description = "") {
    this.undoStack.push({
      state: JSON.parse(JSON.stringify(state)), // Deep copy
      description,
      timestamp: Date.now(),
    });

    // Clear redo stack when new state is added
    this.redoStack = [];

    // Limit stack size
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    this.currentState = state;
  }

  /**
   * Undo to previous state
   * @returns {object|null} Previous state or null if at beginning
   */
  undo() {
    if (this.undoStack.length === 0) return null;

    const current = this.undoStack.pop();
    this.redoStack.push(current);
    this.currentState = this.undoStack[this.undoStack.length - 1]?.state || null;

    return this.currentState;
  }

  /**
   * Redo to next state
   * @returns {object|null} Next state or null if at end
   */
  redo() {
    if (this.redoStack.length === 0) return null;

    const next = this.redoStack.pop();
    this.undoStack.push(next);
    this.currentState = next.state;

    return this.currentState;
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * Get current state
   * @returns {object|null}
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * Get history stack
   * @returns {object[]} Array of history entries
   */
  getHistory() {
    return this.undoStack.map((entry, index) => ({
      index,
      description: entry.description,
      timestamp: entry.timestamp,
    }));
  }

  /**
   * Clear all history
   */
  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.currentState = null;
  }

  /**
   * Get manager state
   * @returns {object}
   */
  getState() {
    return {
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      history: this.getHistory(),
    };
  }
}

/**
 * Transformation Pipeline Manager
 * Manages sequence of transformations
 */
export class TransformationPipeline {
  constructor() {
    this.steps = [];
    this.results = [];
  }

  /**
   * Add transformation step
   * @param {string} name - Transformation name
   * @param {function} operation - Function that performs transformation
   * @param {object} parameters - Operation parameters
   */
  addStep(name, operation, parameters = {}) {
    this.steps.push({
      id: this.steps.length,
      name,
      operation,
      parameters,
    });
  }

  /**
   * Execute pipeline
   * @param {object} initialState - Initial state object
   * @returns {object[]} Results at each step
   */
  execute(initialState) {
    this.results = [{ step: 0, state: JSON.parse(JSON.stringify(initialState)) }];

    let currentState = JSON.parse(JSON.stringify(initialState));

    this.steps.forEach((step, index) => {
      const result = step.operation(currentState, step.parameters);
      currentState = result;

      this.results.push({
        step: index + 1,
        name: step.name,
        state: JSON.parse(JSON.stringify(result)),
        parameters: step.parameters,
      });
    });

    return this.results;
  }

  /**
   * Get result at specific step
   * @param {number} stepIndex - Step index
   * @returns {object|null}
   */
  getStepResult(stepIndex) {
    return this.results[stepIndex] || null;
  }

  /**
   * Get all results
   * @returns {object[]}
   */
  getAllResults() {
    return this.results;
  }

  /**
   * Clear pipeline
   */
  clear() {
    this.steps = [];
    this.results = [];
  }

  /**
   * Get pipeline state
   * @returns {object}
   */
  getState() {
    return {
      totalSteps: this.steps.length,
      stepsList: this.steps.map((s, i) => ({
        step: i,
        name: s.name,
        parameters: s.parameters,
      })),
      resultsCount: this.results.length,
    };
  }
}

/**
 * Transformation Batch Manager
 * Manages multiple simultaneous transformations
 */
export class TransformationBatch {
  constructor() {
    this.transformations = [];
    this.isExecuting = false;
  }

  /**
   * Add transformation to batch
   * @param {object} transform - Transformation object
   */
  add(transform) {
    this.transformations.push({
      id: this.transformations.length,
      ...transform,
      startTime: null,
      endTime: null,
      isComplete: false,
    });
  }

  /**
   * Execute all transformations in batch
   * @param {function} callback - Callback for each completed transformation
   * @returns {Promise}
   */
  async executeBatch(callback = null) {
    this.isExecuting = true;

    const promises = this.transformations.map((transform) => {
      return new Promise((resolve) => {
        transform.startTime = Date.now();

        if (typeof transform.operation === "function") {
          transform.operation(transform.parameters);
        }

        transform.endTime = Date.now();
        transform.isComplete = true;

        if (callback) callback(transform);
        resolve(transform);
      });
    });

    await Promise.all(promises);
    this.isExecuting = false;

    return this.transformations;
  }

  /**
   * Get batch status
   * @returns {object}
   */
  getStatus() {
    const completed = this.transformations.filter((t) => t.isComplete).length;
    return {
      total: this.transformations.length,
      completed,
      pending: this.transformations.length - completed,
      isExecuting: this.isExecuting,
      transformations: this.transformations.map((t) => ({
        id: t.id,
        name: t.name || "Transform",
        isComplete: t.isComplete,
        duration: t.endTime && t.startTime ? t.endTime - t.startTime : null,
      })),
    };
  }

  /**
   * Clear batch
   */
  clear() {
    this.transformations = [];
    this.isExecuting = false;
  }

  /**
   * Get batch state
   * @returns {object}
   */
  getState() {
    return this.getStatus();
  }
}

export default { HistoryManager, TransformationPipeline, TransformationBatch };
