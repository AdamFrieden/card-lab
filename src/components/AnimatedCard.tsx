import { useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import type { Card as CardType, AnimationConfig } from '../types';
import { createTransition } from '../utils/transitions';
import { useTheme } from '../theme';

interface AnimatedCardProps {
  card: CardType;
  layoutId: string;
  isSelected?: boolean;
  onSelect?: (cardId: string) => void;
  animationConfig: AnimationConfig;
  inSlot?: boolean;
}

const AnimatedCardComponent = function AnimatedCard({
  card,
  layoutId,
  isSelected = false,
  onSelect,
  animationConfig,
  inSlot = false
}: AnimatedCardProps) {
  const theme = useTheme();
  const transition = useMemo(() => createTransition(animationConfig), [animationConfig]);

  const handleClick = useCallback(() => {
    if (onSelect) onSelect(card.id);
  }, [onSelect, card.id]);

  return (
    <motion.div
      layoutId={layoutId}
      onClick={handleClick}
      whileTap={onSelect ? { scale: 0.95 } : undefined}
      animate={{
        scale: inSlot ? 0.7 : isSelected ? animationConfig.cardScale : 1,
        y: isSelected && !inSlot ? -animationConfig.cardLift : 0,
      }}
      transition={{
        layout: transition,
        scale: transition,
        y: transition,
      }}
      layoutScroll={false}
      style={{
        minWidth: theme.dimensions.card.width,
        width: theme.dimensions.card.width,
        height: theme.dimensions.card.height,
        background: theme.colors.background.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        cursor: inSlot ? 'default' : 'pointer',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: isSelected ? theme.shadows.cardSelected : theme.shadows.card,
        position: 'relative',
        zIndex: isSelected ? theme.zIndex.overlay : theme.zIndex.card,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <h3 style={{
        margin: `0 0 ${theme.spacing.sm} 0`,
        fontSize: theme.typography.fontSize.md,
        color: 'white',
        textAlign: 'center',
      }}>
        {card.name}
      </h3>
      <p style={{
        margin: 0,
        fontSize: theme.typography.fontSize.xs,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
      }}>
        {card.description}
      </p>
      <div style={{
        marginTop: theme.spacing.md,
        padding: `6px ${theme.spacing.md}`,
        background: theme.colors.overlay.medium,
        borderRadius: theme.radius.xxl,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.bold,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
      }}>
        ⚡ {card.powerValue}
      </div>
    </motion.div>
  );
};

// Memoize with custom comparison to prevent re-renders when props haven't changed
export const AnimatedCard = memo(AnimatedCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.inSlot === nextProps.inSlot &&
    prevProps.animationConfig === nextProps.animationConfig &&
    prevProps.onSelect === nextProps.onSelect
  );
});
