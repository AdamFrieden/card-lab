import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AnimationConfig, Card } from '../types';
import './PackOpeningView.css';

interface PackOpeningViewProps {
  animationConfig: AnimationConfig;
}

// Generate random cards for the pack
const generatePackCards = (): Card[] => {
  const cardNames = ['Ace', 'King', 'Queen', 'Jack', 'Joker', 'Wild'];
  const cards: Card[] = [];

  for (let i = 0; i < 3; i++) {
    const randomName = cardNames[Math.floor(Math.random() * cardNames.length)];
    cards.push({
      id: `pack-card-${Date.now()}-${i}`,
      name: `${randomName} Card`,
      description: 'Revealed from pack!',
      powerValue: Math.floor(Math.random() * 10) + 1,
    });
  }

  return cards;
};

// Memoized card positioning calculation
const getCardPositioning = (cardId: string, index: number) => {
  const seed = cardId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed * 9301 + 49297) % 233280 / 233280;

  return {
    baseRotation: (index - 1) * 8,
    randomRotation: (random - 0.5) * 15,
    randomX: (random - 0.5) * 40,
    randomY: (random - 0.5) * 20,
    stackOffset: index * 3,
  };
};

export function PackOpeningView({ animationConfig }: PackOpeningViewProps) {
  const [packState, setPackState] = useState<'idle' | 'shaking' | 'opening' | 'opened'>('idle');
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Memoize card positioning to avoid recalculation on every render
  const cardPositions = revealedCards.map((card, index) =>
    getCardPositioning(card.id, index)
  );

  const handlePackTap = () => {
    if (packState !== 'idle') return;

    // Shake animation
    setPackState('shaking');

    setTimeout(() => {
      setPackState('opening');
      const cards = generatePackCards();
      setRevealedCards(cards);

      setTimeout(() => {
        setPackState('opened');
      }, 1000);
    }, 600); // After shake completes
  };

  const handleReset = () => {
    setPackState('idle');
    setRevealedCards([]);
    setSelectedCardId(null);
  };

  return (
    <div className="pack-opening-view">
      {/* Pack Component */}
      {packState !== 'opened' && (
        <>
          <motion.div
            className="pack"
            onClick={handlePackTap}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              // Consolidate all animations into single motion.div to avoid transform conflicts
              scale: packState === 'opening'
                ? [1, 1.2, 0]  // Burst effect
                : packState === 'idle'
                  ? [1, 1.05, 1]  // Breathing effect
                  : 1,  // Default/shaking
              rotate: packState === 'shaking'
                ? [-5, 5, -5, 5, -2, 2, 0]  // Shake effect
                : packState === 'idle'
                  ? 0
                  : -180,  // Initial spin-in
              x: packState === 'shaking' ? [-10, 10, -10, 10, -5, 5, 0] : 0,
              y: packState === 'idle' ? [0, -15, 0] : 0,  // Breathing float
              opacity: packState === 'opening' ? [1, 1, 0] : 1,
            }}
            transition={{
              scale: packState === 'idle'
                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                : packState === 'opening'
                  ? { duration: 0.6, ease: 'easeOut' }
                  : { type: 'spring', stiffness: 200, damping: 15 },
              rotate: packState === 'shaking'
                ? { duration: 0.6, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 150, damping: 12 },
              x: { duration: 0.6, ease: 'easeInOut' },
              y: {
                duration: 2,
                repeat: packState === 'idle' ? Infinity : 0,
                ease: 'easeInOut',
              },
              opacity: { duration: 0.3, delay: 0.3 },
            }}
          >
            <div className="pack-shine" />
            <div className="pack-content">
              <div className="pack-icon">🎴</div>
              <div className="pack-title">Card Pack</div>
              <div className="pack-subtitle">Tap to open!</div>
            </div>
          </motion.div>

          {/* Burst particles - separate from pack to avoid nesting */}
          {packState === 'opening' && (
            <div className="burst-particles">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * 45 * Math.PI) / 180) * 150,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 150,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                  }}
                  style={{ willChange: 'transform, opacity' }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Revealed Cards */}
      <div className="revealed-cards">
        {revealedCards.map((card, index) => {
          const position = cardPositions[index];
          const isSelected = selectedCardId === card.id;

          return (
            <motion.div
              key={card.id}
              className={`revealed-card ${isSelected ? 'selected' : ''}`}
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{
                scale: isSelected ? 1.15 : 1,
                rotate: isSelected ? 0 : position.baseRotation + position.randomRotation,
                x: isSelected ? 0 : position.randomX,
                y: isSelected ? -40 : position.randomY + position.stackOffset,
                opacity: 1,
              }}
              transition={{
                delay: index * 0.15,
                type: 'spring',
                stiffness: animationConfig.springStiffness,
                damping: animationConfig.springDamping,
              }}
              whileHover={!isSelected ? {
                scale: 1.15,
                rotate: 0,
                y: -40,
              } : undefined}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCardId(card.id)}
              style={{
                zIndex: isSelected ? 10 : index,
                willChange: 'transform, opacity'
              }}
            >
              <div className="card-glow" />
              <div className="card-content">
                <h3>{card.name}</h3>
                <p>{card.description}</p>
                <div className="card-power">⚡ {card.powerValue}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reset Button */}
      {packState === 'opened' && (
        <motion.button
          className="reset-button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Open Another Pack
        </motion.button>
      )}

      {/* Config Display */}
      <div className="pack-config-display">
        <p>Transition: {animationConfig.transitionType}</p>
        <p>Stiffness: {animationConfig.springStiffness}</p>
        <p>Damping: {animationConfig.springDamping}</p>
      </div>
    </div>
  );
}
