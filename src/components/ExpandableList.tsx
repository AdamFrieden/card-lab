import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme';

interface ExpandableListProps {
  title: string;
  emoji: string;
  count: number;
  maxCount: number;
  children: React.ReactNode;
  index?: number; // For asymmetric positioning
}

export function ExpandableList({ title, emoji, count, maxCount, children, index = 0 }: ExpandableListProps) {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Asymmetric positioning and rotation based on index
  const rotations = [-1, 0.5, -0.5];
  const offsets = [10, -10, 5];
  const idleRotate = rotations[index % rotations.length];
  const marginOffset = offsets[index % offsets.length];

  return (
    <motion.div
      initial={{ y: -200, opacity: 0, rotate: idleRotate - 15, scale: 0.9 }}
      animate={{
        y: 0,
        opacity: 1,
        rotate: isExpanded ? 0 : idleRotate,
        scale: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 18,
        delay: index * 0.12,
        rotate: {
          type: 'spring',
          stiffness: 180,
          damping: 22,
        },
        scale: {
          type: 'spring',
          stiffness: 150,
          damping: 20,
        },
      }}
      style={{
        width: '100%',
        maxWidth: 500,
        marginLeft: marginOffset,
        perspective: '1000px',
      }}
    >
      {/* Header Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{
          scale: 1.05,
          rotate: 0,
          y: -4,
          boxShadow: theme.shadows.cardHover,
        }}
        whileTap={{ scale: 0.97, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.lg,
          background: isExpanded ? theme.colors.background.panel : theme.colors.background.card,
          border: isExpanded ? `2px solid ${theme.colors.border.strong}` : `2px solid ${theme.colors.border.default}`,
          borderRadius: theme.radius.sm,
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: isExpanded ? theme.shadows.glowStrong : theme.shadows.glow,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Left: Icon and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
        }}>
          <motion.span
            animate={{
              rotate: isExpanded ? [0, 10, -10, 0] : 0,
            }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
            style={{ fontSize: '32px' }}
          >
            {emoji}
          </motion.span>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{
              margin: 0,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.primary,
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}>
              {title}
            </h3>
            <p style={{
              margin: 0,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              fontWeight: 600,
            }}>
              {count} / {maxCount}
            </p>
          </div>
        </div>

        {/* Right: Expand Icon */}
        <motion.div
          animate={{
            rotate: isExpanded ? 180 : 0,
            y: isExpanded ? [-2, 0] : 0,
          }}
          transition={{
            rotate: { type: 'spring', stiffness: 200, damping: 15 },
            y: { duration: 0.2 },
          }}
          style={{
            fontSize: '20px',
            color: theme.colors.text.tertiary,
            fontWeight: 'bold',
          }}
        >
          ▼
        </motion.div>
      </motion.button>

      {/* Expandable List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{
              height: { type: 'spring', stiffness: 300, damping: 25 },
              opacity: { duration: 0.3 },
              y: { type: 'spring', stiffness: 300, damping: 25 },
            }}
            style={{
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              style={{
                marginTop: theme.spacing.md,
                maxHeight: '400px',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: `${theme.spacing.sm} ${theme.spacing.xs}`,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
                // Custom scrollbar styling
                scrollbarWidth: 'thin',
                scrollbarColor: `${theme.colors.border.default} transparent`,
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
