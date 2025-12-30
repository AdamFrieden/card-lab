import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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

interface CardHandItemProps {
  card: CardType;
  index: number;
  isSelected: boolean;
  onSelectCard: (cardId: string) => void;
  animationConfig: AnimationConfig;
}

// Separate component for each card to avoid hook violations
function CardHandItem({ card, index, isSelected, onSelectCard, animationConfig }: CardHandItemProps) {
  const { enableBreathing, breathingStrength, breathingStyle } = animationConfig;

  // Calculate breathing animation based on style
  let yMotion: number | number[] = 0;
  let xMotion: number | number[] = 0;
  let scaleMotion: number | number[] = 1;
  let duration = 2.5;

  if (enableBreathing && !isSelected) {
    const strength = breathingStrength;

    switch (breathingStyle) {
      case 'gentle':
        yMotion = [0, -8 * strength, 0];
        scaleMotion = [1, 1 + (0.03 * strength), 1];
        duration = 2.5 + index * 0.3;
        break;
      case 'wave':
        yMotion = [0, -12 * strength, 0];
        scaleMotion = [1, 1 + (0.04 * strength), 1];
        duration = 2.0 + index * 0.5;
        break;
      case 'pulse':
        yMotion = [0, -6 * strength, 0];
        scaleMotion = [1, 1 + (0.06 * strength), 1];
        duration = 2.2;
        break;
      case 'drift':
        xMotion = [0, 10 * strength, 0, -10 * strength, 0];
        yMotion = [0, -4 * strength, 0, -4 * strength, 0];
        scaleMotion = [1, 1 + (0.02 * strength), 1, 1 + (0.02 * strength), 1];
        duration = 4.0 + index * 0.2;
        break;
    }
  }

  // 3D tilt effect for selected cards
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [15, -15]);
  const rotateY = useTransform(mouseX, [-100, 100], [-15, 15]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSelected) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.8 }}
      animate={{
        y: isSelected ? 0 : yMotion,
        x: isSelected ? 0 : xMotion,
        opacity: 1,
        scale: isSelected ? 1 : scaleMotion,
      }}
      transition={{
        y: enableBreathing && !isSelected
          ? { duration, repeat: Infinity, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 300, damping: 25 },
        x: enableBreathing && !isSelected
          ? { duration, repeat: Infinity, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 300, damping: 25 },
        scale: enableBreathing && !isSelected
          ? { duration, repeat: Infinity, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 300, damping: 25 },
        opacity: {
          type: 'spring',
          stiffness: 300,
          damping: 25,
          delay: index === 0 ? 0.25 : 0,
        },
      }}
      layout
      style={{
        display: 'flex',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        style={{
          rotateX: isSelected ? rotateX : 0,
          rotateY: isSelected ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
      >
        <AnimatedCard
          layoutId={`card-${card.id}`}
          card={card}
          isSelected={isSelected}
          onSelect={onSelectCard}
          animationConfig={animationConfig}
        />
      </motion.div>
    </motion.div>
  );
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
              <CardHandItem
                key={card.id}
                card={card}
                index={index}
                isSelected={selectedCardId === card.id}
                onSelectCard={onSelectCard}
                animationConfig={animationConfig}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
