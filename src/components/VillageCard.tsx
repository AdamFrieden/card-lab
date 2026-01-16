import { motion } from 'framer-motion';
import { useTheme } from '../theme';

interface VillageCardProps {
  id: string;
  name: string;
  type: 'critter' | 'building' | 'gear';
  image?: string;
  level?: number;
  description?: string;
}

export function VillageCard({ name, type, image, level, description, id }: VillageCardProps) {
  const theme = useTheme();

  const getTypeEmoji = () => {
    switch (type) {
      case 'critter': return '🦊';
      case 'building': return '🏠';
      case 'gear': return '⚔️';
    }
  };

  // Generate unique rotation for each card based on ID
  const cardRotation = (parseInt(id.slice(-1), 36) % 3 - 1) * 0.5;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: theme.shadows.cardHover,
        transition: { type: 'spring', stiffness: 400, damping: 17 },
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        background: theme.colors.background.panel,
        borderRadius: theme.radius.sm,
        border: `2px solid ${theme.colors.border.default}`,
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: theme.shadows.card,
      }}
    >
      {/* Image or Icon */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: theme.radius.sm,
          background: theme.colors.background.card,
          border: `2px solid ${theme.colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          flexShrink: 0,
          boxShadow: theme.shadows.glow,
          overflow: 'hidden',
        }}
      >
        {image ? (
          <motion.img
            src={image}
            alt={name}
            animate={{
              scale: [1, 1.08, 1],
              rotate: [cardRotation - 3, cardRotation + 3, cardRotation - 3],
              x: [-1, 1, -1],
            }}
            transition={{
              scale: {
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              },
              rotate: {
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              },
              x: {
                duration: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 1.5,
              },
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        ) : (
          <motion.span
            animate={{
              scale: [1, 1.1, 1],
              rotate: [cardRotation - 5, cardRotation + 5, cardRotation - 5],
            }}
            transition={{
              scale: {
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              },
              rotate: {
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              },
            }}
          >
            {getTypeEmoji()}
          </motion.span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.xs,
        }}>
          <h4 style={{
            margin: 0,
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.primary,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {name}
          </h4>
          {level !== undefined && (
            <span style={{
              padding: `2px ${theme.spacing.sm}`,
              background: theme.colors.background.app,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.radius.circle,
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>
              Lv {level}
            </span>
          )}
        </div>
        {description && (
          <p style={{
            margin: 0,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
