import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, withOpacity } from '../theme';

interface ExpandableListProps {
  title: string;
  emoji: string;
  count: number;
  maxCount: number;
  children: React.ReactNode;
}

export function ExpandableList({ title, emoji, count, maxCount, children }: ExpandableListProps) {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      width: '100%',
      maxWidth: 500,
    }}>
      {/* Header Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.lg,
          background: isExpanded
            ? theme.colors.brand.primaryGradient
            : theme.colors.background.card,
          border: `1px solid ${isExpanded ? theme.colors.brand.primary : theme.colors.border.default}`,
          borderRadius: theme.radius.xl,
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: isExpanded
            ? `0 4px 16px ${withOpacity(theme.colors.brand.primary, 0.3)}`
            : theme.shadows.card,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Left: Icon and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
        }}>
          <span style={{ fontSize: '32px' }}>{emoji}</span>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{
              margin: 0,
              fontSize: theme.typography.fontSize.lg,
              color: 'white',
              fontWeight: theme.typography.fontWeight.semibold,
            }}>
              {title}
            </h3>
            <p style={{
              margin: 0,
              fontSize: theme.typography.fontSize.sm,
              color: isExpanded ? 'rgba(255, 255, 255, 0.8)' : theme.colors.text.secondary,
            }}>
              {count} / {maxCount}
            </p>
          </div>
        </div>

        {/* Right: Expand Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: '24px',
            color: isExpanded ? 'white' : theme.colors.text.secondary,
          }}
        >
          ▼
        </motion.div>
      </motion.button>

      {/* Expandable List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              overflow: 'hidden',
            }}
          >
            <div style={{
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
            }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
