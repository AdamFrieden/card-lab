import { motion } from 'framer-motion';
import type { Card as CardType } from '../types';
import './Card.css';

interface AnimatedCardProps {
  card: CardType;
  layoutId: string;
  isSelected?: boolean;
  onSelect?: () => void;
  animationConfig: {
    cardScale: number;
    cardLift: number;
    springStiffness: number;
    springDamping: number;
  };
  inSlot?: boolean;
}

export function AnimatedCard({
  card,
  layoutId,
  isSelected = false,
  onSelect,
  animationConfig,
  inSlot = false
}: AnimatedCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className={`card ${isSelected ? 'selected' : ''} ${inSlot ? 'in-slot' : ''}`}
      onClick={onSelect}
      whileTap={onSelect ? { scale: 0.95 } : undefined}
      animate={{
        scale: isSelected && !inSlot ? animationConfig.cardScale : 1,
        y: isSelected && !inSlot ? -animationConfig.cardLift : 0,
      }}
      transition={{
        layout: {
          type: 'spring',
          stiffness: animationConfig.springStiffness,
          damping: animationConfig.springDamping,
        },
        scale: {
          type: 'spring',
          stiffness: animationConfig.springStiffness,
          damping: animationConfig.springDamping,
        },
        y: {
          type: 'spring',
          stiffness: animationConfig.springStiffness,
          damping: animationConfig.springDamping,
        }
      }}
    >
      <h3>{card.name}</h3>
      <p>{card.description}</p>
      <div className="card-power">⚡ {card.powerValue}</div>
    </motion.div>
  );
}
