import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme';
import { JuicyNumber } from './JuicyNumber';
import type { EncounterSlot as SlotType, EncounterPhase, FloatingLabel } from '../../types/encounter';
import type { EncounterAnimationTimings } from '../../config/encounterAnimationConfig';

interface SlotProjection {
  baseValue: number;
  bonuses: Array<{ amount: number; description: string }>;
  totalValue: number;
}

interface EncounterSlotProps {
  slot: SlotType;
  index: number;
  projection: SlotProjection;
  isHighlighted: boolean;
  floatingLabels: FloatingLabel[];
  onSlotClick: (slotId: string) => void;
  phase: EncounterPhase;
  timings: EncounterAnimationTimings;
  side: 'player' | 'enemy';
  selectedCritterId?: string | null; // Only for player slots
}

export function EncounterSlot({
  slot,
  index,
  projection,
  isHighlighted,
  floatingLabels,
  onSlotClick,
  phase,
  timings,
  side,
  selectedCritterId,
}: EncounterSlotProps) {
  const theme = useTheme();
  const isEmpty = !slot.critter;
  const isTargeted = isEmpty && selectedCritterId && side === 'player';
  const isPlayer = side === 'player';

  return (
    <motion.div
      key={slot.id}
      initial={{ opacity: 0, x: isPlayer ? -20 : 20 }}
      animate={{
        opacity: 1,
        x: 0,
        boxShadow: isHighlighted
          ? `0 0 24px ${isPlayer ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)'}, inset 0 0 12px ${isPlayer ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)'}`
          : isEmpty
            ? 'none'
            : '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      }}
      transition={{ delay: index * timings.slotEntranceDelay, duration: timings.slotEntranceDuration }}
      onClick={() => isPlayer && onSlotClick(slot.id)}
      whileHover={phase === 'rostering' && isPlayer ? { scale: 1.02, y: -2 } : {}}
      whileTap={phase === 'rostering' && isPlayer ? { scale: 0.98 } : {}}
      style={{
        background: isEmpty
          ? 'transparent'
          : `linear-gradient(135deg, ${theme.colors.background.card} 0%, ${theme.colors.background.panel} 100%)`,
        border: isEmpty
          ? `2px dashed ${isTargeted ? theme.colors.brand.primary : theme.colors.border.subtle}`
          : 'none',
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
        minHeight: 80,
        cursor: phase === 'rostering' && isPlayer ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.xs,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle inner glow for filled slots */}
      {!isEmpty && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Floating trait labels (player only) */}
      {isPlayer && (
        <AnimatePresence>
          {floatingLabels
            .filter(label => label.slotId === slot.id)
            .map((label) => (
              <motion.div
                key={label.id}
                initial={{
                  opacity: 0,
                  y: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [0, -20, -40, -60],
                  scale: [0.5, 1.1, 1, 0.9],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: timings.floatingLabelDuration / 1000,
                  times: [0, 0.15, 0.7, 1],
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '30%',
                  transform: 'translateX(-50%)',
                  zIndex: 100,
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {/* Amount badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    background: label.color === 'green'
                      ? 'rgba(76, 175, 80, 0.95)'
                      : label.color === 'red'
                        ? 'rgba(244, 67, 54, 0.95)'
                        : 'rgba(255, 193, 7, 0.95)',
                    color: label.color === 'gold' ? '#2d2520' : '#fff',
                    padding: '4px 12px',
                    borderRadius: theme.radius.md,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: 800,
                    boxShadow: label.color === 'green'
                      ? '0 0 20px rgba(76, 175, 80, 0.5), 0 4px 12px rgba(0,0,0,0.3)'
                      : label.color === 'red'
                        ? '0 0 20px rgba(244, 67, 54, 0.5), 0 4px 12px rgba(0,0,0,0.3)'
                        : '0 0 20px rgba(255, 193, 7, 0.5), 0 4px 12px rgba(0,0,0,0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  +{label.amount}
                </motion.div>

                {/* Trait text */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [5, 0, 0, -5] }}
                  transition={{ duration: 1, times: [0, 0.2, 0.7, 1] }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: theme.radius.sm,
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: 600,
                    maxWidth: 140,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {label.text}
                </motion.div>
              </motion.div>
            ))}
        </AnimatePresence>
      )}

      {slot.critter ? (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            width: '100%',
          }}>
            {slot.critter.image && (
              <img
                src={slot.critter.image}
                alt={slot.critter.name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.radius.sm,
                  objectFit: 'cover',
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}>
                {slot.critter.name}
              </div>
              {isPlayer && slot.critter.trait && (
                <div style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                }}>
                  {slot.critter.trait.text}
                </div>
              )}
            </div>

            {/* Power badge inline for enemy */}
            {!isPlayer && (
              <div style={{
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: 'rgba(244, 67, 54, 0.15)',
                borderRadius: theme.radius.sm,
              }}>
                <JuicyNumber
                  value={slot.critter.level || 0}
                  size="sm"
                  color="#f44336"
                  accentColor="#ef5350"
                />
              </div>
            )}
          </div>

          {/* Projection badge for player only (below) */}
          {isPlayer && (
            <div
              style={{
                alignSelf: 'flex-end',
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: projection.bonuses.length > 0
                  ? 'rgba(76, 175, 80, 0.2)'
                  : theme.colors.background.app,
                borderRadius: theme.radius.sm,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <JuicyNumber
                value={projection.totalValue}
                size="sm"
                color={projection.bonuses.length > 0 ? '#4caf50' : theme.colors.text.primary}
                accentColor="#66bb6a"
              />
              {projection.bonuses.length > 0 && (
                <span style={{
                  fontWeight: 400,
                  fontSize: theme.typography.fontSize.xs,
                  color: '#4caf50',
                }}>
                  (+{projection.bonuses.reduce((s, b) => s + b.amount, 0)})
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <motion.div
          animate={isTargeted ? {
            opacity: [0.5, 0.8, 0.5],
          } : { opacity: 0.6 }}
          transition={isTargeted ? {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          } : {}}
          style={{
            color: isTargeted ? theme.colors.brand.primary : theme.colors.text.tertiary,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: isTargeted ? 600 : 400,
          }}
        >
          {isTargeted ? '+ Tap to assign' : 'Empty'}
        </motion.div>
      )}
    </motion.div>
  );
}
