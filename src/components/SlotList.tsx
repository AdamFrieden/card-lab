import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard } from './AnimatedCard';
import type { Slot, AnimationConfig } from '../types';
import './SlotList.css';

interface SlotListProps {
  slots: Slot[];
  previewSlotId: string | null;
  animationConfig: AnimationConfig;
  onUnrosterCard: (slotId: string) => void;
  unrosteringCardId: string | null;
}

export function SlotList({ slots, previewSlotId, animationConfig, onUnrosterCard, unrosteringCardId }: SlotListProps) {
  // Memoized unroster handler - prevents inline function allocations
  const handleUnroster = useCallback((slotId: string) => {
    onUnrosterCard(slotId);
  }, [onUnrosterCard]);

  return (
    <div className="slot-list-container">
      <div className="slot-list">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`slot ${slot.card ? 'filled' : ''} ${previewSlotId === slot.id ? 'preview' : ''}`}
          >
            {slot.card ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={slot.card.id}
                  className="slot-card-wrapper"
                  initial={false}
                  animate={{
                    opacity: unrosteringCardId === slot.card.id ? 0 : 1,
                    scale: unrosteringCardId === slot.card.id ? 0.8 : 1,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                  }}
                >
                  <AnimatedCard
                    card={slot.card}
                    layoutId={`card-${slot.card.id}`}
                    animationConfig={animationConfig}
                    inSlot={true}
                  />
                  <motion.button
                    className="unroster-button"
                    onClick={() => handleUnroster(slot.id)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 20,
                    }}
                  >
                    ✕
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="slot-empty">
                Empty Slot
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
