import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface JuicyNumberProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  accentColor?: string;
  showSign?: boolean;
  className?: string;
}

// Size configurations
const sizeConfig = {
  sm: { base: 14, max: 18, weightBase: 600, weightMax: 700 },
  md: { base: 18, max: 24, weightBase: 600, weightMax: 800 },
  lg: { base: 24, max: 32, weightBase: 700, weightMax: 900 },
  xl: { base: 28, max: 40, weightBase: 700, weightMax: 900 },
};

export function JuicyNumber({
  value,
  size = 'md',
  color = '#2d2520',
  accentColor = '#4caf50',
  showSign = false,
  className,
}: JuicyNumberProps) {
  const controls = useAnimation();
  const prevValueRef = useRef(value);
  const [displayColor, setDisplayColor] = useState(color);
  const isFirstRender = useRef(true);

  const config = sizeConfig[size];

  // Calculate dynamic font size and weight based on value magnitude
  const magnitude = Math.abs(value);
  const sizeScale = Math.min(1, magnitude / 30); // Scale up to 30
  const fontSize = config.base + (config.max - config.base) * sizeScale;
  const fontWeight = Math.round(
    config.weightBase + (config.weightMax - config.weightBase) * sizeScale
  );

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevValueRef.current = value;
      return;
    }

    const prevValue = prevValueRef.current;
    const delta = Math.abs(value - prevValue);

    if (delta === 0) return;

    // Calculate animation intensity based on delta
    const intensity = Math.min(1, delta / 10); // Normalize to 0-1
    const scaleAmount = 1.15 + intensity * 0.15; // 1.15 to 1.30
    const shakeAmount = 2 + intensity * 4; // 2px to 6px

    // Flash accent color
    setDisplayColor(accentColor);

    // Run pop + shake animation
    controls.start({
      scale: [1, scaleAmount, 1.05, 1],
      x: [0, -shakeAmount, shakeAmount, -shakeAmount * 0.5, shakeAmount * 0.5, 0],
      transition: {
        duration: 0.35,
        times: [0, 0.2, 0.6, 1],
        x: {
          duration: 0.3,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        },
      },
    });

    // Reset color after flash
    const colorTimeout = setTimeout(() => {
      setDisplayColor(color);
    }, 150);

    prevValueRef.current = value;

    return () => clearTimeout(colorTimeout);
  }, [value, color, accentColor, controls]);

  // Update color when prop changes (not from animation)
  useEffect(() => {
    if (!isFirstRender.current) {
      setDisplayColor(color);
    }
  }, [color]);

  const displayValue = showSign && value > 0 ? `+${value}` : value.toString();

  return (
    <motion.span
      animate={controls}
      className={className}
      style={{
        display: 'inline-block',
        fontSize: `${fontSize}px`,
        fontWeight,
        color: displayColor,
        transition: 'color 0.15s ease-out',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {displayValue}
    </motion.span>
  );
}
