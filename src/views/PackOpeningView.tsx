import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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

export function PackOpeningView({ animationConfig }: PackOpeningViewProps) {
  const [packState, setPackState] = useState<'idle' | 'shaking' | 'opening' | 'opened'>('idle');
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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
        <motion.div
          className="pack-container"
          onClick={handlePackTap}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
            y: packState === 'idle' ? [0, -15, 0] : 0,
          }}
          transition={{
            scale: { type: 'spring', stiffness: 200, damping: 15 },
            rotate: { type: 'spring', stiffness: 150, damping: 12 },
            y: {
              duration: 2,
              repeat: packState === 'idle' ? Infinity : 0,
              ease: 'easeInOut',
            },
          }}
        >
          <motion.div
            className="pack"
            animate={{
              // Scale handles both breathing (idle) and burst (opening) effects
              scale: packState === 'opening'
                ? [1, 1.2, 0]  // Burst effect
                : packState === 'idle'
                  ? [1, 1.05, 1]  // Breathing effect
                  : 1,  // Default/shaking
              // Shake effect
              x: packState === 'shaking' ? [-10, 10, -10, 10, -5, 5, 0] : 0,
              rotate: packState === 'shaking' ? [-5, 5, -5, 5, -2, 2, 0] : 0,
              opacity: packState === 'opening' ? [1, 1, 0] : 1,
            }}
            transition={{
              scale: packState === 'idle'
                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.6, ease: 'easeOut' },
              x: { duration: 0.6, ease: 'easeInOut' },
              rotate: { duration: 0.6, ease: 'easeInOut' },
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

          {/* Burst particles */}
          {packState === 'opening' && (
            <div className="burst-particles">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * 30 * Math.PI) / 180) * 150,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 150,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Revealed Cards */}
      <div className="revealed-cards">
        {revealedCards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`revealed-card ${selectedCardId === card.id ? 'selected' : ''}`}
            initial={{ scale: 0, y: 0, x: 0, rotate: 0, opacity: 0 }}
            animate={{
              scale: 1,
              y: packState === 'opened' ? 0 : -50,
              x: packState === 'opened' ? (index - 1) * 180 : 0,
              rotate: packState === 'opened' ? (index - 1) * 5 : 0,
              opacity: 1,
            }}
            transition={{
              delay: index * 0.15,
              type: 'spring',
              stiffness: animationConfig.springStiffness,
              damping: animationConfig.springDamping,
            }}
            whileHover={{ scale: 1.1, rotate: 0, y: -20 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCardId(card.id)}
          >
            <div className="card-glow" />
            <div className="card-content">
              <h3>{card.name}</h3>
              <p>{card.description}</p>
              <div className="card-power">⚡ {card.powerValue}</div>
            </div>
          </motion.div>
        ))}
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
