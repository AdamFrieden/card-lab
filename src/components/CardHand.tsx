import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import type { Card as CardType, AnimationConfig } from '../types';
import './CardHand.css';

interface CardHandProps {
  cards: CardType[];
  selectedCardId: string | null;
  rosteringCardId: string | null;
  unrosteringCardId: string | null;
  onSelectCard: (cardId: string) => void;
  animationConfig: AnimationConfig;
}

export function CardHand({ cards, selectedCardId, rosteringCardId, unrosteringCardId, onSelectCard, animationConfig }: CardHandProps) {
  const [isVisible, setIsVisible] = useState(true);

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

      <div className="card-hand-container">
        <div className="card-hand-inner">
          <motion.div
            className="card-hand"
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
            <AnimatePresence>
              {cards.map((card, index) => {
                const isUnrostering = unrosteringCardId === card.id;

                return (
                  <motion.div
                    key={card.id}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: rosteringCardId === card.id ? 0 : 1,
                    }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{
                      delay: isVisible && !isUnrostering ? index * animationConfig.staggerDelay : 0,
                      type: 'spring',
                      stiffness: animationConfig.springStiffness,
                      damping: animationConfig.springDamping,
                    }}
                    style={{
                      flexShrink: 0,
                    }}
                  >
                    <Card
                      card={card}
                      isSelected={selectedCardId === card.id}
                      onSelect={() => onSelectCard(card.id)}
                      animationConfig={animationConfig}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}
