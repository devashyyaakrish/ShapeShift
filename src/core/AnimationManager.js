/**
 * Animation Manager
 * Handles transformation animations and state management
 */

export class AnimationManager {
  constructor() {
    this.isAnimating = false;
    this.startTime = 0;
    this.duration = 3000; // milliseconds
    this.currentProgress = 0;
    this.callbacks = {
      onFrame: null,
      onComplete: null,
    };
    this.animationMode = null; // 'rotate', 'scale', 'translate', etc.
    this.parameters = {}; // Mode-specific parameters
  }

  /**
   * Start animation
   * @param {string} mode - Animation mode ('rotate', 'scale', 'translate', etc.)
   * @param {object} parameters - Mode-specific parameters
   * @param {number} duration - Animation duration in ms
   * @param {function} onFrame - Callback on each frame
   * @param {function} onComplete - Callback when complete
   */
  start(mode, parameters = {}, duration = 3000, onFrame = null, onComplete = null) {
    this.isAnimating = true;
    this.animationMode = mode;
    this.parameters = parameters;
    this.duration = duration;
    this.startTime = Date.now();
    this.currentProgress = 0;
    this.callbacks.onFrame = onFrame;
    this.callbacks.onComplete = onComplete;
  }

  /**
   * Stop animation
   */
  stop() {
    this.isAnimating = false;
    this.animationMode = null;
  }

  /**
   * Update animation state (should be called from animation loop)
   * @returns {object} Current animation state
   */
  update() {
    if (!this.isAnimating) {
      return { progress: this.currentProgress, isComplete: true };
    }

    const elapsed = Date.now() - this.startTime;
    this.currentProgress = Math.min(elapsed / this.duration, 1);

    const state = {
      progress: this.currentProgress,
      isComplete: this.currentProgress >= 1,
      mode: this.animationMode,
      parameters: this.parameters,
    };

    if (this.callbacks.onFrame) {
      this.callbacks.onFrame(state);
    }

    if (state.isComplete) {
      this.isAnimating = false;
      if (this.callbacks.onComplete) {
        this.callbacks.onComplete(state);
      }
    }

    return state;
  }

  /**
   * Get eased progress (0-1) using easing function
   * @param {string} easing - Easing function name
   * @returns {number} Eased progress value
   */
  getEasedProgress(easing = "linear") {
    const t = this.currentProgress;

    switch (easing) {
      case "easeIn":
        return t * t;
      case "easeOut":
        return 1 - (1 - t) * (1 - t);
      case "easeInOut":
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case "easeInCubic":
        return t * t * t;
      case "easeOutCubic":
        return 1 - Math.pow(1 - t, 3);
      case "easeInOutCubic":
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      case "elastic":
        return t === 0
          ? 0
          : t === 1
            ? 1
            : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3));
      case "bounce":
        return t < 0.5
          ? (1 - Math.cos(Math.PI * t)) / 2
          : (1 + Math.cos(Math.PI * (t - 1))) / 2;
      default:
        return t;
    }
  }

  /**
   * Get current animation parameters with progress applied
   * @param {string} easing - Easing function
   * @returns {object} Interpolated parameters
   */
  getInterpolatedParameters(easing = "linear") {
    const easedProgress = this.getEasedProgress(easing);

    const result = { ...this.parameters };

    // Interpolate all numeric parameters
    Object.keys(result).forEach((key) => {
      if (
        typeof result[key] === "number" &&
        result[key].startValue !== undefined &&
        result[key].endValue !== undefined
      ) {
        const start = result[key].startValue;
        const end = result[key].endValue;
        result[key] = start + (end - start) * easedProgress;
      }
    });

    return result;
  }

  /**
   * Get animation state
   * @returns {object} Current state
   */
  getState() {
    return {
      isAnimating: this.isAnimating,
      progress: this.currentProgress,
      mode: this.animationMode,
      parameters: this.parameters,
      duration: this.duration,
    };
  }
}

/**
 * Transition Manager
 * Manages smooth transitions between transformation states
 */
export class TransitionManager {
  constructor() {
    this.transitions = [];
    this.activeTransition = null;
  }

  /**
   * Create a transition
   * @param {object} fromState - Starting state
   * @param {object} toState - Ending state
   * @param {number} duration - Duration in ms
   * @param {string} easing - Easing function
   * @returns {object} Transition object
   */
  createTransition(fromState, toState, duration = 1000, easing = "easeInOut") {
    const transition = {
      id: Math.random(),
      fromState,
      toState,
      duration,
      easing,
      startTime: Date.now(),
      isComplete: false,
    };

    this.transitions.push(transition);
    return transition;
  }

  /**
   * Update all active transitions
   * @returns {object[]} Updated transitions
   */
  update() {
    const now = Date.now();

    return this.transitions.map((transition) => {
      const elapsed = now - transition.startTime;
      const progress = Math.min(elapsed / transition.duration, 1);

      const easedProgress = this.getEasedProgress(progress, transition.easing);

      transition.interpolatedState = this.interpolateStates(
        transition.fromState,
        transition.toState,
        easedProgress
      );

      if (progress >= 1) {
        transition.isComplete = true;
      }

      return transition;
    });
  }

  /**
   * Interpolate between two states
   * @param {object} fromState - Starting state
   * @param {object} toState - Ending state
   * @param {number} progress - Progress (0-1)
   * @returns {object} Interpolated state
   */
  interpolateStates(fromState, toState, progress) {
    const result = {};

    // Handle matrix interpolation (simplified - linear interpolation of elements)
    if (fromState.currentMatrix && toState.currentMatrix) {
      result.currentMatrix = fromState.currentMatrix.map((row, i) =>
        row.map((val, j) => val + (toState.currentMatrix[i][j] - val) * progress)
      );
    }

    // Handle numeric properties
    Object.keys(toState).forEach((key) => {
      if (
        typeof toState[key] === "number" &&
        typeof fromState[key] === "number"
      ) {
        result[key] = fromState[key] + (toState[key] - fromState[key]) * progress;
      }
    });

    return result;
  }

  /**
   * Get eased progress
   * @param {number} progress - Raw progress (0-1)
   * @param {string} easing - Easing function
   * @returns {number} Eased progress
   */
  getEasedProgress(progress, easing = "linear") {
    const t = progress;

    switch (easing) {
      case "easeIn":
        return t * t;
      case "easeOut":
        return 1 - (1 - t) * (1 - t);
      case "easeInOut":
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case "easeInCubic":
        return t * t * t;
      case "easeOutCubic":
        return 1 - Math.pow(1 - t, 3);
      default:
        return t;
    }
  }

  /**
   * Complete all transitions
   */
  completeAll() {
    this.transitions = this.transitions.filter((t) => !t.isComplete);
  }

  /**
   * Clear transitions
   */
  clear() {
    this.transitions = [];
  }

  /**
   * Get transition state
   * @returns {object} Current transitions
   */
  getState() {
    return {
      totalTransitions: this.transitions.length,
      activeTransitions: this.transitions.filter((t) => !t.isComplete).length,
      transitions: this.transitions,
    };
  }
}

export default { AnimationManager, TransitionManager };
