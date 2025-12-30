import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import './PowerCounter.css';

interface PowerCounterProps {
  value: number;
}

export function PowerCounter({ value }: PowerCounterProps) {
  const prevValue = useRef(value);
  const springValue = useSpring(value, {
    stiffness: 100,
    damping: 20,
    mass: 1,
  });
  const display = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    prevValue.current = value;
    springValue.set(value);
  }, [value, springValue]);

  return (
    <div className="power-counter">
      <div className="power-counter-label">Total Power</div>
      <motion.div
        className="power-counter-value"
        animate={{
          scale: prevValue.current !== value ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      >
        <span className="power-icon">⚡</span>
        <motion.span>{display}</motion.span>
      </motion.div>
    </div>
  );
}
