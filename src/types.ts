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

export interface AnimationConfig {
  cardScale: number;
  cardLift: number;
  springStiffness: number;
  springDamping: number;
  staggerDelay: number;
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  cardScale: 1.1,
  cardLift: 20,
  springStiffness: 300,
  springDamping: 20,
  staggerDelay: 0.05,
};
