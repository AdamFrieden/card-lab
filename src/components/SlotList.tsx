import { useCallback, useRef, useEffect } from 'react';
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
  onSelectSlot?: (slotId: string) => void;
  shouldScrollToPreview?: boolean; // Control whether to auto-scroll to preview slot
}

export function SlotList({ slots, previewSlotId, animationConfig, onUnrosterCard, unrosteringCardId, onSelectSlot, shouldScrollToPreview = false }: SlotListProps) {
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
