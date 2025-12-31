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
      }, 800);  // Adjusted for faster burst
    }, 500); // Faster shake completes in 500ms
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
                ? [1, 1.4, 0]  // Burst effect - increased from 1.2 to 1.4
                : packState === 'idle'
                  ? [1, 1.05, 1]  // Breathing effect
                  : packState === 'shaking'
                    ? [1, 0.95, 1.05, 0.95, 1]  // Shake scale variation
                    : 1,  // Default
              rotate: packState === 'shaking'
                ? [-15, 15, -15, 15, -12, 12, -8, 8, -5, 5, 0]  // More vigorous shake
                : packState === 'idle'
                  ? 0
                  : -180,  // Initial spin-in
              x: packState === 'shaking' ? [-25, 25, -25, 25, -20, 20, -12, 12, -5, 5, 0] : 0,  // Stronger horizontal shake
              y: packState === 'shaking'
                ? [-8, 8, -8, 8, -5, 5, -3, 3, 0]  // Added vertical shake
                : packState === 'idle'
                  ? [0, -15, 0]
                  : 0,  // Breathing float
              opacity: packState === 'opening' ? [1, 0] : 1,  // Fade out immediately when bursting
            }}
            transition={{
              scale: packState === 'idle'
                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                : packState === 'opening'
                  ? { duration: 0.5, ease: 'easeOut' }  // Slightly faster burst
                  : packState === 'shaking'
                    ? { duration: 0.5, ease: 'linear' }  // Faster shake with linear easing
                    : { type: 'spring', stiffness: 200, damping: 15 },
              rotate: packState === 'shaking'
                ? { duration: 0.5, ease: 'linear' }  // Faster, more frantic rotation
                : { type: 'spring', stiffness: 150, damping: 12 },
              x: packState === 'shaking'
                ? { duration: 0.5, ease: 'linear' }  // Fast horizontal shake
                : { duration: 0.6, ease: 'easeInOut' },
              y: {
                duration: packState === 'shaking' ? 0.5 : 2,  // Fast vertical shake
                repeat: packState === 'idle' ? Infinity : 0,
                ease: packState === 'shaking' ? 'linear' : 'easeInOut',
              },
              opacity: packState === 'opening'
                ? { duration: 0.15, ease: 'easeOut' }  // Quick fade out when bursting
                : { duration: 0.25, delay: 0.25 },
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
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],  // Larger particles
                    x: Math.cos((i * 22.5 * Math.PI) / 180) * 250,  // More spread (16 particles at 22.5° intervals)
                    y: Math.sin((i * 22.5 * Math.PI) / 180) * 250,
                    opacity: [1, 1, 0],
                    rotate: [0, 360],  // Add rotation to particles
                  }}
                  transition={{
                    duration: 0.7,  // Faster particles
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
              initial={{
                scale: 0,
                rotate: position.baseRotation + position.randomRotation,
                x: position.randomX,
                y: position.randomY + position.stackOffset,
                opacity: 0
              }}
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
                transition: { type: 'spring', stiffness: 600, damping: 25 }
              } : undefined}
              whileTap={{
                scale: 0.95,
                transition: { type: 'spring', stiffness: 600, damping: 25 }
              }}
              onClick={() => setSelectedCardId(isSelected ? null : card.id)}
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
