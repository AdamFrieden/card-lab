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

export function VillageCard({ name, type, image, level, description }: VillageCardProps) {
  const theme = useTheme();

  const getTypeEmoji = () => {
    switch (type) {
      case 'critter': return '🦊';
      case 'building': return '🏠';
      case 'gear': return '⚔️';
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        background: theme.colors.background.card,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border.default}`,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Image or Icon */}
      <div style={{
        width: 60,
        height: 60,
        borderRadius: theme.radius.md,
        background: theme.colors.overlay.medium,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        flexShrink: 0,
      }}>
        {image ? (
          <img src={image} alt={name} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: theme.radius.md,
          }} />
        ) : (
          getTypeEmoji()
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
            color: 'white',
            fontWeight: theme.typography.fontWeight.semibold,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {name}
          </h4>
          {level !== undefined && (
            <span style={{
              padding: `2px ${theme.spacing.sm}`,
              background: theme.colors.overlay.medium,
              borderRadius: theme.radius.xxl,
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary,
              fontWeight: theme.typography.fontWeight.medium,
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
