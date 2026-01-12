import { useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slot, AnimationConfig, SlotTextAnimationStyle } from '../types';
import './SlotList.css';

interface SlotListProps {
  slots: Slot[];
  previewSlotId: string | null;
  onUnrosterCard: (slotId: string) => void;
  unrosteringCardId: string | null;
  onSelectSlot?: (slotId: string) => void;
  shouldScrollToPreview?: boolean; // Control whether to auto-scroll to preview slot
  animationConfig: AnimationConfig;
}

// Helper function to get text animation variants based on style
const getTextAnimationVariants = (style: SlotTextAnimationStyle) => {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    bounce: {
      initial: { opacity: 0, scale: 0.5, rotate: -10 },
      animate: { opacity: 1, scale: 1, rotate: 0 },
    },
  };

  return variants[style];
};

export function SlotList({ slots, previewSlotId, onUnrosterCard, unrosteringCardId, onSelectSlot, shouldScrollToPreview = false, animationConfig }: SlotListProps) {
  const slotRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to preview slot when it changes (only when shouldScrollToPreview is true)
  useEffect(() => {
    if (shouldScrollToPreview && previewSlotId && containerRef.current) {
      const slotElement = slotRefs.current.get(previewSlotId);
      if (slotElement && containerRef.current) {
        // Calculate the correct scroll position using getBoundingClientRect
        // This gives us the actual position relative to the viewport
        const containerRect = containerRef.current.getBoundingClientRect();
        const slotRect = slotElement.getBoundingClientRect();

        // Calculate how far the slot is from the top of the container
        const slotOffsetFromContainerTop = slotRect.top - containerRect.top;

        // Add current scroll position to get absolute scroll position
        const currentScrollTop = containerRef.current.scrollTop;

        // Target position: current scroll + offset from top - desired breathing room
        const breathingRoom = 20; // Space from top of container
        const targetScrollTop = currentScrollTop + slotOffsetFromContainerTop - breathingRoom;

        containerRef.current.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [previewSlotId, shouldScrollToPreview]);
  // Memoized unroster handler - prevents inline function allocations
  const handleUnroster = useCallback((slotId: string) => {
    onUnrosterCard(slotId);
  }, [onUnrosterCard]);

  // Memoized slot click handler for empty slots
  const handleSlotClick = useCallback((slotId: string) => {
    if (onSelectSlot) {
      onSelectSlot(slotId);
    }
  }, [onSelectSlot]);

  return (
    <div className="slot-list-container" ref={containerRef}>
      <div className="slot-list">
        {slots.map((slot) => (
          <div
            key={slot.id}
            ref={(el) => {
              if (el) {
                slotRefs.current.set(slot.id, el);
              } else {
                slotRefs.current.delete(slot.id);
              }
            }}
            className={`slot ${slot.card ? 'filled' : ''} ${previewSlotId === slot.id ? 'preview' : ''} ${animationConfig.compactSlots ? 'compact' : ''}`}
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
                  <div className={`slot-character-display ${animationConfig.compactSlots ? 'compact' : ''}`}>
                    {/* Only the image has layoutId for shared layout animation */}
                    <motion.div layoutId={`card-${slot.card.id}`}>
                      {slot.card.characterImage ? (
                        <img
                          src={slot.card.characterImage}
                          alt={slot.card.name}
                          className={`slot-character-image ${animationConfig.compactSlots ? 'compact' : ''}`}
                        />
                      ) : (
                        <div className={`slot-character-placeholder ${animationConfig.compactSlots ? 'compact' : ''}`}>
                          <span>🎴</span>
                        </div>
                      )}
                    </motion.div>

                    {/* Text elements animate in separately with configurable style */}
                    <div className={`slot-card-info ${animationConfig.compactSlots ? 'compact' : ''}`}>
                      <motion.h4
                        {...getTextAnimationVariants(animationConfig.slotTextAnimationStyle)}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                          delay: animationConfig.slotTextDelay,
                        }}
                      >
                        {slot.card.name}
                      </motion.h4>
                      <motion.div
                        className="slot-card-power"
                        {...getTextAnimationVariants(animationConfig.slotTextAnimationStyle)}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                          delay: animationConfig.slotTextDelay + animationConfig.slotTextStagger,
                        }}
                      >
                        ⚡ {slot.card.powerValue}
                      </motion.div>
                    </div>
                  </div>
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
                <span className="slot-empty-label">Empty Slot</span>
                <button
                  className="slot-select-button"
                  onClick={() => handleSlotClick(slot.id)}
                >
                  Select
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
