import { motion } from 'framer-motion';
import { useTheme } from '../../theme';

interface ScoreProgressBarProps {
  current: number;
  projection: number;
  side: 'player' | 'enemy';
  isComplete?: boolean;
}

export function ScoreProgressBar({
  current,
  projection,
  side,
  isComplete = false,
}: ScoreProgressBarProps) {
  const theme = useTheme();

  // Calculate fill percentage (can exceed 100%)
  const fillPercent = projection > 0 ? (current / projection) * 100 : 0;
  const isOver = fillPercent > 100;
  const isUnder = isComplete && fillPercent < 100;
  const isAtTarget = isComplete && fillPercent >= 98 && fillPercent <= 102;

  // Colors based on state and side
  const baseColor = side === 'player' ? '#4caf50' : '#f44336';
  const overColor = '#ffd700'; // Gold for exceeding projection
  const underColor = side === 'player' ? '#c62828' : '#7f1d1d'; // Darker red for under

  // Determine bar color
  let barColor = baseColor;
  let glowColor = 'transparent';

  if (isComplete) {
    if (isOver) {
      barColor = overColor;
      glowColor = 'rgba(255, 215, 0, 0.6)';
    } else if (isUnder) {
      barColor = underColor;
    }
  }

  // Calculate visual fill (cap at 130% for overflow display)
  const visualFill = Math.min(fillPercent, 130);

  return (
    <div style={{
      width: '100%',
      height: 6,
      background: 'rgba(0, 0, 0, 0.15)',
      borderRadius: 3,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Target line at 100% */}
      <div style={{
        position: 'absolute',
        left: 'calc(100% - 2px)',
        top: 0,
        bottom: 0,
        width: 2,
        background: 'rgba(0, 0, 0, 0.3)',
        zIndex: 2,
      }} />

      {/* Fill bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: `${visualFill}%`,
          backgroundColor: barColor,
        }}
        transition={{
          width: { duration: 0.3, ease: 'easeOut' },
          backgroundColor: { duration: 0.2 },
        }}
        style={{
          height: '100%',
          borderRadius: 3,
          position: 'relative',
          boxShadow: isOver && isComplete
            ? `0 0 12px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.4)`
            : 'inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        {/* Shimmer effect for overflow */}
        {isOver && isComplete && (
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              width: '50%',
            }}
          />
        )}
      </motion.div>

      {/* Pulse effect when complete and over */}
      {isOver && isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            inset: -2,
            background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
            borderRadius: 5,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Dimming overlay for under-projection */}
      {isUnder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 3,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
