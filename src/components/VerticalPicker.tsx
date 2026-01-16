import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useTheme } from '../theme';
import './VerticalPicker.css';

interface VerticalPickerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji?: string;
  children: React.ReactNode;
  maxCount?: number; // Optional: if provided, shows empty slots
  currentCount?: number; // Optional: number of filled slots (defaults to children count)
}

export function VerticalPicker({ isOpen, onClose, title, emoji, children, maxCount, currentCount }: VerticalPickerProps) {
  const theme = useTheme();

  // Calculate empty slots if maxCount is provided
  const childrenArray = Array.isArray(children) ? children : [children];
  const filledCount = currentCount ?? childrenArray.length;
  const emptySlotCount = maxCount ? Math.max(0, maxCount - filledCount) : 0;

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when picker is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const pickerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: theme.zIndex.modal,
            }}
          />

          {/* Picker Container */}
          <motion.div
            initial={{ opacity: 0, x: '-50%', y: '-48%' }}
            animate={{ opacity: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, x: '-50%', y: '-48%' }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1], // cubic-bezier for smooth easing
            }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '90%',
              maxWidth: 600,
              maxHeight: '80vh',
              background: theme.colors.background.app,
              borderRadius: theme.radius.xl,
              border: `3px solid ${theme.colors.border.strong}`,
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
              zIndex: theme.zIndex.modal + 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              willChange: 'opacity, transform',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: theme.spacing.lg,
                paddingBottom: theme.spacing.md,
                borderBottom: `2px solid ${theme.colors.border.default}`,
                background: theme.colors.background.card,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                {emoji && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1,
                    }}
                    style={{ fontSize: '32px' }}
                  >
                    {emoji}
                  </motion.span>
                )}
                <h2
                  style={{
                    margin: 0,
                    fontSize: theme.typography.fontSize.xl,
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.text.primary,
                    letterSpacing: '-0.5px',
                  }}
                >
                  {title}
                </h2>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: theme.radius.circle,
                  background: theme.colors.background.panel,
                  border: `2px solid ${theme.colors.border.default}`,
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.lg,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: theme.shadows.button,
                }}
                aria-label="Close"
              >
                ✕
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div
              className="vertical-picker-content"
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: theme.spacing.md,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
              }}
            >
              {children}
              {/* Empty slots */}
              {Array.from({ length: emptySlotCount }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    padding: theme.spacing.md,
                    background: theme.colors.background.app,
                    borderRadius: theme.radius.sm,
                    border: `2px dashed ${theme.colors.border.default}`,
                    opacity: 0.5,
                    minHeight: 76, // Match PickerItem height
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                  }}
                >
                  {/* Empty icon container */}
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: theme.radius.sm,
                      background: theme.colors.background.card,
                      border: `2px dashed ${theme.colors.border.default}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                      opacity: 0.3,
                      userSelect: 'none',
                    }}
                  >
                    {emoji || '?'}
                  </div>

                  {/* Empty text */}
                  <div style={{ flex: 1, userSelect: 'none' }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: theme.typography.fontSize.base,
                        color: theme.colors.text.secondary,
                        fontWeight: theme.typography.fontWeight.bold,
                        fontStyle: 'italic',
                        userSelect: 'none',
                      }}
                    >
                      Empty slot
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Render via portal to ensure it's at root level
  return createPortal(pickerContent, document.body);
}
