import { motion } from 'framer-motion';
import { useTheme } from '../theme';

interface PickerItemProps {
  id: string;
  name: string;
  image?: string;
  level?: number;
  description?: string;
  bonus?: string; // Gear bonus effect (displayed prominently)
  trait?: string; // Critter trait effect (displayed prominently like bonus)
  icon?: string;
  isSelected?: boolean;
  isExhausted?: boolean;
  exhaustedTimer?: string; // Countdown display (e.g., "2:30" or "45s")
  onClick?: (id: string) => void;
  layout?: 'compact' | 'horizontal';
}

export function PickerItem({
  id,
  name,
  image,
  level,
  description,
  bonus,
  trait,
  icon,
  isSelected = false,
  isExhausted = false,
  exhaustedTimer,
  onClick,
  layout = 'horizontal',
}: PickerItemProps) {
  const theme = useTheme();

  const handleClick = () => {
    if (onClick) onClick(id);
  };

  // Generate subtle unique rotation based on ID
  const itemRotation = (parseInt(id.slice(-1), 36) % 3 - 1) * 0.3;

  if (layout === 'compact') {
    // Compact vertical card layout (similar to AnimatedCard)
    return (
      <motion.div
        whileHover={{
          y: -4,
          boxShadow: theme.shadows.cardHover,
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        onClick={handleClick}
        style={{
          minWidth: 100,
          width: 100,
          height: 140,
          background: isSelected ? theme.colors.background.app : theme.colors.background.panel,
          borderRadius: theme.radius.sm,
          border: isSelected
            ? `3px solid ${theme.colors.border.strong}`
            : `2px solid ${theme.colors.border.default}`,
          padding: theme.spacing.sm,
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: isSelected ? theme.shadows.cardSelected : theme.shadows.card,
          transform: `rotate(${itemRotation}deg)`,
          transition: 'border 0.2s ease',
        }}
      >
        {/* Image or Icon */}
        {image ? (
          <img
            src={image}
            alt={name}
            style={{
              width: 50,
              height: 65,
              objectFit: 'cover',
              borderRadius: theme.radius.sm,
              marginBottom: theme.spacing.xs,
            }}
          />
        ) : icon ? (
          <div style={{ fontSize: '32px', marginBottom: theme.spacing.xs }}>
            {icon}
          </div>
        ) : null}

        {/* Name */}
        <h4
          style={{
            margin: `0 0 ${theme.spacing.xs} 0`,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {name}
        </h4>

        {/* Level Badge */}
        {level !== undefined && (
          <div
            style={{
              padding: `2px ${theme.spacing.sm}`,
              background: theme.colors.background.app,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.radius.circle,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.tertiary,
            }}
          >
            Lv {level}
          </div>
        )}
      </motion.div>
    );
  }

  // Horizontal layout (similar to VillageCard)
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: theme.shadows.cardHover,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        background: isExhausted
          ? theme.colors.overlay.light
          : isSelected ? theme.colors.background.app : theme.colors.background.panel,
        borderRadius: theme.radius.sm,
        border: isSelected
          ? `3px solid ${theme.colors.border.strong}`
          : `2px solid ${theme.colors.border.default}`,
        cursor: isExhausted ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        boxShadow: isSelected ? theme.shadows.cardSelected : theme.shadows.card,
        transform: `rotate(${itemRotation}deg)`,
        transition: 'border 0.2s ease',
        opacity: isExhausted ? 0.6 : 1,
        filter: isExhausted ? 'grayscale(40%)' : 'none',
      }}
    >
      {/* Image or Icon Container */}
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
              scale: [1, 1.05, 1],
              rotate: [itemRotation - 2, itemRotation + 2, itemRotation - 2],
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        ) : icon ? (
          <motion.span
            animate={{
              scale: [1, 1.1, 1],
              rotate: [itemRotation - 3, itemRotation + 3, itemRotation - 3],
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
            {icon}
          </motion.span>
        ) : null}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {bonus || trait ? (
          // Gear/Critter layout with special abilities: Show name prominently, then effect and description
          <>
            <h4
              style={{
                margin: 0,
                marginBottom: '2px',
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.bold,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
              <p
                style={{
                  margin: 0,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  fontWeight: theme.typography.fontWeight.bold,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {bonus || trait}
              </p>
              {description && (
                <>
                  <span style={{ color: theme.colors.text.tertiary }}>•</span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.tertiary,
                      fontWeight: 500,
                      fontStyle: 'italic',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {description}
                  </p>
                </>
              )}
            </div>
          </>
        ) : (
          // Standard layout: Name as title, description as subtitle (for items without traits/bonuses)
          <>
            <h4
              style={{
                margin: 0,
                marginBottom: theme.spacing.xs,
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.bold,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </h4>
            {description && (
              <p
                style={{
                  margin: 0,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {description}
              </p>
            )}
          </>
        )}
      </div>

      {/* Status Badge with Timer */}
      {isExhausted && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '2px',
            flexShrink: 0,
            marginLeft: theme.spacing.sm,
          }}
        >
          <span
            style={{
              padding: `3px ${theme.spacing.sm}`,
              background: theme.colors.overlay.medium,
              border: `1px solid ${theme.colors.border.strong}`,
              borderRadius: theme.radius.sm,
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.primary,
              fontWeight: theme.typography.fontWeight.bold,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Exhausted
          </span>
          {exhaustedTimer && (
            <span
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.tertiary,
                fontWeight: theme.typography.fontWeight.bold,
                whiteSpace: 'nowrap',
              }}
            >
              ⏱ {exhaustedTimer}
            </span>
          )}
        </div>
      )}

      {/* Level - Always aligned */}
      {level !== undefined && (
        <div
          style={{
            fontSize: theme.typography.fontSize.xl,
            color: theme.colors.text.tertiary,
            fontWeight: theme.typography.fontWeight.bold,
            flexShrink: 0,
            minWidth: 40,
            textAlign: 'center',
            marginLeft: theme.spacing.sm,
          }}
        >
          {level}
        </div>
      )}

    </motion.div>
  );
}
