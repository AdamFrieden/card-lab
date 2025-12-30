import { useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import type { Card as CardType, AnimationConfig } from '../types';
import { createTransition } from '../utils/transitions';
import './Card.css';

interface AnimatedCardProps {
  card: CardType;
  layoutId: string;
  isSelected?: boolean;
  onSelect?: (cardId: string) => void;
  animationConfig: AnimationConfig;
  inSlot?: boolean;
}

const AnimatedCardComponent = function AnimatedCard({
  card,
  layoutId,
  isSelected = false,
  onSelect,
  animationConfig,
  inSlot = false
}: AnimatedCardProps) {
  const transition = useMemo(() => createTransition(animationConfig), [animationConfig]);

  const handleClick = useCallback(() => {
    if (onSelect) onSelect(card.id);
  }, [onSelect, card.id]);

  return (
    <motion.div
      layoutId={layoutId}
      className={`card ${isSelected ? 'selected' : ''} ${inSlot ? 'in-slot' : ''}`}
      onClick={handleClick}
      whileTap={onSelect ? { scale: 0.95 } : undefined}
      animate={{
        scale: inSlot ? 0.7 : isSelected ? animationConfig.cardScale : 1,
        y: isSelected && !inSlot ? -animationConfig.cardLift : 0,
      }}
      transition={{
        layout: transition,
        scale: transition,
        y: transition,
      }}
      layoutScroll={false}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      <h3>{card.name}</h3>
      <p>{card.description}</p>
      <div className="card-power">⚡ {card.powerValue}</div>
    </motion.div>
  );
};

// Memoize with custom comparison to prevent re-renders when props haven't changed
export const AnimatedCard = memo(AnimatedCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.inSlot === nextProps.inSlot &&
    prevProps.animationConfig === nextProps.animationConfig &&
    prevProps.onSelect === nextProps.onSelect
  );
});
