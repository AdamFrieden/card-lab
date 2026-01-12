export interface Card {
  id: string;
  name: string;
  description: string;
  powerValue: number;
  characterImage?: string;
}

export interface Slot {
  id: string;
  card: Card | null;
}

export type TransitionType = 'spring' | 'tween' | 'bounce' | 'elastic';
export type BreathingStyle = 'gentle' | 'wave' | 'pulse' | 'drift';
export type TiltMode = 'off' | 'selected' | 'always';
export type SlotTextAnimationStyle = 'fade' | 'slideLeft' | 'slideUp' | 'scale' | 'bounce';

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
  tiltMode: TiltMode;
  slotTextAnimationStyle: SlotTextAnimationStyle;
  slotTextDelay: number;
  slotTextStagger: number;
  compactSlots: boolean;
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
  tiltMode: 'selected',  // 3D tilt effect mode for card hand
  slotTextAnimationStyle: 'slideLeft',  // How text animates into slot
  slotTextDelay: 0.3,  // Delay after image lands before text animates in
  slotTextStagger: 0.1,  // Delay between name and power badge
  compactSlots: false,  // Use compact horizontal slot layout
};
