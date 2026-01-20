import { useState, useCallback, useRef } from 'react';

interface ShakeConfig {
  intensity?: number; // Base shake amount in pixels (default: 4)
  duration?: number; // Duration in ms (default: 300)
  decay?: number; // How quickly shake decays (default: 0.9)
}

interface ShakeState {
  x: number;
  y: number;
  rotation: number;
}

export function useScreenShake() {
  const [shake, setShake] = useState<ShakeState>({ x: 0, y: 0, rotation: 0 });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const triggerShake = useCallback((config: ShakeConfig = {}) => {
    const { intensity = 4, duration = 300, decay = 0.9 } = config;

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        setShake({ x: 0, y: 0, rotation: 0 });
        return;
      }

      // Decay factor based on progress
      const decayFactor = Math.pow(decay, progress * 10);
      const currentIntensity = intensity * decayFactor * (1 - progress);

      // Random shake values
      const x = (Math.random() - 0.5) * 2 * currentIntensity;
      const y = (Math.random() - 0.5) * 2 * currentIntensity;
      const rotation = (Math.random() - 0.5) * currentIntensity * 0.5;

      setShake({ x, y, rotation });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Convenience methods for different shake intensities
  const shakeLight = useCallback(() => {
    triggerShake({ intensity: 2, duration: 200 });
  }, [triggerShake]);

  const shakeMedium = useCallback(() => {
    triggerShake({ intensity: 4, duration: 300 });
  }, [triggerShake]);

  const shakeHeavy = useCallback(() => {
    triggerShake({ intensity: 8, duration: 400 });
  }, [triggerShake]);

  const shakeVictory = useCallback(() => {
    triggerShake({ intensity: 6, duration: 500, decay: 0.85 });
  }, [triggerShake]);

  const shakeDefeat = useCallback(() => {
    triggerShake({ intensity: 10, duration: 600, decay: 0.8 });
  }, [triggerShake]);

  // Style object to apply to container
  const shakeStyle = {
    transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rotation}deg)`,
  };

  return {
    shake,
    shakeStyle,
    triggerShake,
    shakeLight,
    shakeMedium,
    shakeHeavy,
    shakeVictory,
    shakeDefeat,
  };
}
