import type { Transition } from 'framer-motion';
import type { AnimationConfig } from '../types';

/**
 * Creates a unified transition configuration based on the animation config.
 * This ensures consistent animations for rostering, unrostering, and all card movements.
 */
export function createTransition(config: AnimationConfig): Transition {
  switch (config.transitionType) {
    case 'spring':
      return {
        type: 'spring',
        stiffness: config.springStiffness,
        damping: config.springDamping,
        restDelta: 0.001,  // Tighter settling threshold for smoother completion
        restSpeed: 0.001,  // Lower rest speed for cleaner stops
      };

    case 'tween':
      return {
        type: 'tween',
        duration: config.transitionDuration,
        ease: [0.16, 1, 0.3, 1],  // Smooth ease-out-expo for ultra-smooth motion
      };

    case 'bounce':
      return {
        type: 'spring',
        stiffness: config.springStiffness,
        damping: config.springDamping * 0.5, // Less damping = more bounce
        mass: 1.5,
        restDelta: 0.001,
        restSpeed: 0.001,
      };

    case 'elastic':
      return {
        type: 'spring',
        stiffness: config.springStiffness * 0.6,
        damping: config.springDamping * 0.4,
        mass: 2,
        restDelta: 0.001,
        restSpeed: 0.001,
      };

    default:
      return {
        type: 'spring',
        stiffness: config.springStiffness,
        damping: config.springDamping,
        restDelta: 0.001,
        restSpeed: 0.001,
      };
  }
}

