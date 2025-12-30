import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from './AnimatedCard';
import type { Card as CardType, AnimationConfig } from '../types';
import './CardHand.css';

interface CardHandProps {
  cards: CardType[];
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  animationConfig: AnimationConfig;
  onScrollPositionChange?: (visibleIndex: number) => void;
}

export function CardHand({ cards, selectedCardId, onSelectCard, animationConfig, onScrollPositionChange }: CardHandProps) {
  const [isVisible, setIsVisible] = useState(true);
  const handRef = useRef<HTMLDivElement>(null);

  // Track scroll position and calculate visible card index
  useEffect(() => {
    const handElement = handRef.current;
    if (!handElement || !onScrollPositionChange) return;

    const handleScroll = () => {
      const scrollLeft = handElement.scrollLeft;
      const cardWidth = 140 + 12; // card width + gap
      const visibleIndex = Math.round(scrollLeft / cardWidth);
      onScrollPositionChange(Math.max(0, Math.min(visibleIndex, cards.length - 1)));
    };

    handElement.addEventListener('scroll', handleScroll);
    return () => handElement.removeEventListener('scroll', handleScroll);
  }, [cards.length, onScrollPositionChange]);

  return (
    <>
      <motion.button
        className="hand-toggle-button"
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isVisible ? 0 : 180,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {isVisible ? '🃏' : '👆'}
      </motion.button>

      <motion.div
        className="card-hand-container"
        initial={{ y: 300, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : 300,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
      >
        <div className="card-hand-inner">
          <div className="card-hand" ref={handRef}>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ y: 100, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: index === 0 ? 0.25 : 0, // Delay only for first card (newly unrostered)
                }}
                layout // Smooth position changes when cards shift
                style={{ display: 'flex' }}
              >
                <AnimatedCard
                  layoutId={`card-${card.id}`}
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onSelect={onSelectCard}
                  animationConfig={animationConfig}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
