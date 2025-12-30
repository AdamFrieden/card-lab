export interface Card {
  id: string;
  name: string;
  description: string;
  powerValue: number;
}

export interface Slot {
  id: string;
  card: Card | null;
}

export type TransitionType = 'spring' | 'tween' | 'bounce' | 'elastic';
export type BreathingStyle = 'gentle' | 'wave' | 'pulse' | 'drift';

export interface AnimationConfig {
  cardScale: number;
  cardLift: number;
  springStiffness: number;
  springDamping: number;
  staggerDelay: number;
  transitionType: TransitionType;
  transitionDuration: number;
  enableBreathing: boolean;
  breathingStrength: number;
  breathingStyle: BreathingStyle;
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  cardScale: 1.1,
  cardLift: 20,
  springStiffness: 300,  // Optimized for smooth, natural motion
  springDamping: 30,     // Higher damping for buttery-smooth settling
  staggerDelay: 0.05,
  transitionType: 'spring',
  transitionDuration: 0.6,
  enableBreathing: false,
  breathingStrength: 1.0,  // Multiplier for breathing animation intensity
  breathingStyle: 'gentle',
};
