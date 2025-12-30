import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard } from './AnimatedCard';
import type { Slot, AnimationConfig } from '../types';
import './SlotList.css';

interface SlotListProps {
  slots: Slot[];
  previewSlotId: string | null;
  animationConfig: AnimationConfig;
  onUnrosterCard: (slotId: string) => void;
}

export function SlotList({ slots, previewSlotId, animationConfig, onUnrosterCard }: SlotListProps) {
  return (
    <div className="slot-list-container">
      <motion.div
        className="slot-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {slots.map((slot, index) => (
          <motion.div
            key={slot.id}
            className={`slot ${slot.card ? 'filled' : ''} ${previewSlotId === slot.id ? 'preview' : ''}`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: index * animationConfig.staggerDelay,
              type: 'spring',
              stiffness: animationConfig.springStiffness,
              damping: animationConfig.springDamping,
            }}
          >
            <AnimatePresence mode="wait">
              {slot.card ? (
                <div key={slot.card.id} className="slot-card-wrapper">
                  <AnimatedCard
                    card={slot.card}
                    layoutId={`card-${slot.card.id}`}
                    animationConfig={animationConfig}
                    inSlot={true}
                  />
                  <motion.button
                    className="unroster-button"
                    onClick={() => onUnrosterCard(slot.id)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
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
                </div>
              ) : (
                <motion.div
                  key="empty"
                  className="slot-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Empty Slot
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
