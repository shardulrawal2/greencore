/**
 * Fallback celebration utilities.
 * canvas-confetti is not installed, so these functions are safe no-ops.
 */

const safeNoOp = () => {
  if (typeof window !== 'undefined' && window?.console) {
    console.log('[celebrations] fallback no-op called');
  }
};

export const celebrateConsolidation = (consolidatedCount = 1) => {
  safeNoOp();
};

export const celebrateJobCompletion = () => {
  safeNoOp();
};

export const celebrateHotspotResolved = () => {
  safeNoOp();
};

export const celebrateOptimization = () => {
  safeNoOp();
};

export default {
  celebrateConsolidation,
  celebrateJobCompletion,
  celebrateHotspotResolved,
  celebrateOptimization,
};
