import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface TickingNumberProps {
  value: number;
  duration?: number; // Duration in ms for the tick animation
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  glowColor?: string;
  className?: string;
}

// Size configurations
const sizeConfig = {
  sm: { fontSize: 14, fontWeight: 600 },
  md: { fontSize: 18, fontWeight: 700 },
  lg: { fontSize: 24, fontWeight: 800 },
  xl: { fontSize: 32, fontWeight: 900 },
};

export function TickingNumber({
  value,
  duration = 400,
  size = 'md',
  color = '#2d2520',
  glowColor,
  className,
}: TickingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const animationRef = useRef<number | null>(null);
  const controls = useAnimation();

  const config = sizeConfig[size];

  useEffect(() => {
    const prevValue = prevValueRef.current;
    const delta = value - prevValue;

    if (delta === 0) return;

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = performance.now();
    const startValue = prevValue;

    // Trigger a pop animation
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.2 },
    });

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.round(startValue + delta * eased);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    prevValueRef.current = value;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, controls]);

  return (
    <motion.span
      animate={controls}
      className={className}
      style={{
        display: 'inline-block',
        fontSize: config.fontSize,
        fontWeight: config.fontWeight,
        color,
        fontVariantNumeric: 'tabular-nums',
        textShadow: glowColor ? `0 0 10px ${glowColor}` : undefined,
      }}
    >
      {displayValue}
    </motion.span>
  );
}
