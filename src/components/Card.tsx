import { AnimatedCard } from './AnimatedCard';
import type { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  isSelected: boolean;
  onSelect: () => void;
  animationConfig: {
    cardScale: number;
    cardLift: number;
    springStiffness: number;
    springDamping: number;
  };
}

export function Card({ card, isSelected, onSelect, animationConfig }: CardProps) {
  return (
    <AnimatedCard
      card={card}
      layoutId={`card-${card.id}`}
      isSelected={isSelected}
      onSelect={onSelect}
      animationConfig={animationConfig}
    />
  );
}
