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
  compact?: boolean;
}

const AnimatedCardComponent = function AnimatedCard({
  card,
  layoutId,
  isSelected = false,
  onSelect,
  animationConfig,
  inSlot = false,
  compact = true,
}: AnimatedCardProps) {
  const theme = useTheme();
  const transition = useMemo(() => createTransition(animationConfig), [animationConfig]);

  const actionButton = card.actionButton;

  const handleClick = useCallback(() => {
    if (onSelect) onSelect(card.id);
  }, [onSelect, card.id]);

  const handleActionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when clicking action button
    if (actionButton) actionButton.onClick(card.id);
  }, [actionButton, card.id]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Action button that slides up from underneath the card when selected */}
      {actionButton && (
        <motion.button
          initial={{ y: 20, x: '-50%', opacity: 0, scale: 0.8 }}
          animate={{
            y: isSelected && !inSlot ? -40 : 20,
            x: '-50%',
            opacity: isSelected && !inSlot ? 1 : 0,
            scale: isSelected && !inSlot ? 1 : 0.8,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
          onClick={handleActionClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            background: theme.colors.background.panel,
            border: `2px solid ${theme.colors.border.strong}`,
            borderRadius: theme.radius.circle,
            color: theme.colors.text.primary,
            fontSize: compact ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.bold,
            cursor: 'pointer',
            boxShadow: theme.shadows.cardSelected,
            pointerEvents: isSelected && !inSlot ? 'auto' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            zIndex: theme.zIndex.overlay + 1,
          }}
        >
          {actionButton.label}
        </motion.button>
      )}

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
          minWidth: compact ? '90px' : theme.dimensions.card.width,
          width: compact ? '90px' : theme.dimensions.card.width,
          height: compact ? '120px' : theme.dimensions.card.height,
          background: theme.colors.background.panel,
          borderRadius: theme.radius.sm,
          border: `2px solid ${theme.colors.border.default}`,
          padding: compact ? theme.spacing.sm : theme.spacing.lg,
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
      {card.characterImage && (
        <img
          src={card.characterImage}
          alt={card.name}
          style={{
            width: compact ? '50px' : '60px',
            height: compact ? '65px' : '80px',
            objectFit: 'cover',
            borderRadius: theme.radius.sm,
            marginBottom: compact ? theme.spacing.xs : theme.spacing.sm,
          }}
        />
      )}
      <h3 style={{
        margin: `0 0 ${compact ? theme.spacing.xs : theme.spacing.sm} 0`,
        fontSize: compact ? theme.typography.fontSize.sm : theme.typography.fontSize.md,
        color: theme.colors.text.primary,
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
      }}>
        {card.name}
      </h3>
      {!compact && (
        <p style={{
          margin: 0,
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.secondary,
          textAlign: 'center',
        }}>
          {card.description}
        </p>
      )}
      <div style={{
        marginTop: compact ? theme.spacing.xs : theme.spacing.md,
        padding: compact ? `4px ${theme.spacing.sm}` : `6px ${theme.spacing.md}`,
        background: theme.colors.background.app,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.radius.circle,
        fontSize: compact ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.tertiary,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
      }}>
        ⚡ {card.powerValue}
      </div>
    </motion.div>
    </div>
  );
};

// Memoize with custom comparison to prevent re-renders when props haven't changed
export const AnimatedCard = memo(AnimatedCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.card.characterImage === nextProps.card.characterImage &&
    prevProps.card.actionButton === nextProps.card.actionButton &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.inSlot === nextProps.inSlot &&
    prevProps.animationConfig === nextProps.animationConfig &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.compact === nextProps.compact
  );
});
