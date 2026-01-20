/**
 * Centralized timing configuration for encounter animations
 * All values in milliseconds unless specified otherwise
 */

export type EncounterAnimationSpeed = 'slow' | 'medium' | 'fast' | 'instant';

export interface EncounterAnimationTimings {
  // Resolution sequence delays
  rollDelay: number;          // Delay after showing base roll
  traitBonusDelay: number;    // Delay between trait bonuses
  critterPauseDelay: number;  // Pause between critters
  enemyRollDelay: number;     // Delay for enemy roll
  finalRevealDelay: number;   // Pause before showing result

  // Floating label
  floatingLabelDuration: number;
  floatingLabelRemoveBuffer: number; // Buffer before removing from DOM

  // Score animations
  tickingNumberDuration: number;
  progressBarFillDuration: number;

  // Screen shake
  shakeLight: number;
  shakeMedium: number;
  shakeHeavy: number;
  shakeVictory: number;
  shakeDefeat: number;

  // Victory banner
  bannerParticleDuration: number;
  bannerEntranceDelay: number;

  // UI transitions (fractions for framer-motion)
  slotEntranceDelay: number;    // Multiplier for stagger
  slotEntranceDuration: number; // Duration in seconds
  cardEntranceDelay: number;    // Multiplier for stagger
  cardEntranceDuration: number; // Duration in seconds
}

// Preset configurations
export const ENCOUNTER_ANIMATION_PRESETS: Record<EncounterAnimationSpeed, EncounterAnimationTimings> = {
  slow: {
    rollDelay: 800,
    traitBonusDelay: 700,
    critterPauseDelay: 400,
    enemyRollDelay: 700,
    finalRevealDelay: 600,

    floatingLabelDuration: 1500,
    floatingLabelRemoveBuffer: 100,

    tickingNumberDuration: 500,
    progressBarFillDuration: 500,

    shakeLight: 300,
    shakeMedium: 450,
    shakeHeavy: 600,
    shakeVictory: 750,
    shakeDefeat: 900,

    bannerParticleDuration: 2000,
    bannerEntranceDelay: 200,

    slotEntranceDelay: 0.08,
    slotEntranceDuration: 0.4,
    cardEntranceDelay: 0.05,
    cardEntranceDuration: 0.35,
  },

  medium: {
    rollDelay: 400,
    traitBonusDelay: 500,
    critterPauseDelay: 200,
    enemyRollDelay: 500,
    finalRevealDelay: 300,

    floatingLabelDuration: 1200,
    floatingLabelRemoveBuffer: 100,

    tickingNumberDuration: 300,
    progressBarFillDuration: 300,

    shakeLight: 200,
    shakeMedium: 300,
    shakeHeavy: 400,
    shakeVictory: 500,
    shakeDefeat: 600,

    bannerParticleDuration: 1500,
    bannerEntranceDelay: 100,

    slotEntranceDelay: 0.05,
    slotEntranceDuration: 0.3,
    cardEntranceDelay: 0.03,
    cardEntranceDuration: 0.25,
  },

  fast: {
    rollDelay: 200,
    traitBonusDelay: 250,
    critterPauseDelay: 100,
    enemyRollDelay: 250,
    finalRevealDelay: 150,

    floatingLabelDuration: 800,
    floatingLabelRemoveBuffer: 100,

    tickingNumberDuration: 150,
    progressBarFillDuration: 200,

    shakeLight: 100,
    shakeMedium: 150,
    shakeHeavy: 200,
    shakeVictory: 250,
    shakeDefeat: 300,

    bannerParticleDuration: 1000,
    bannerEntranceDelay: 50,

    slotEntranceDelay: 0.03,
    slotEntranceDuration: 0.2,
    cardEntranceDelay: 0.02,
    cardEntranceDuration: 0.15,
  },

  instant: {
    rollDelay: 50,
    traitBonusDelay: 50,
    critterPauseDelay: 50,
    enemyRollDelay: 50,
    finalRevealDelay: 50,

    floatingLabelDuration: 400,
    floatingLabelRemoveBuffer: 50,

    tickingNumberDuration: 100,
    progressBarFillDuration: 100,

    shakeLight: 50,
    shakeMedium: 75,
    shakeHeavy: 100,
    shakeVictory: 150,
    shakeDefeat: 150,

    bannerParticleDuration: 500,
    bannerEntranceDelay: 0,

    slotEntranceDelay: 0.01,
    slotEntranceDuration: 0.1,
    cardEntranceDelay: 0.01,
    cardEntranceDuration: 0.1,
  },
};

// Default speed
export const DEFAULT_ENCOUNTER_ANIMATION_SPEED: EncounterAnimationSpeed = 'medium';

// Helper to get timings for a speed
export function getEncounterTimings(speed: EncounterAnimationSpeed = DEFAULT_ENCOUNTER_ANIMATION_SPEED): EncounterAnimationTimings {
  return ENCOUNTER_ANIMATION_PRESETS[speed];
}
