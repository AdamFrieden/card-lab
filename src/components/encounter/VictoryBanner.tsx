import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  velocityX: number;
  velocityY: number;
  delay: number;
}

interface VictoryBannerProps {
  isVictory: boolean;
  playerScore: number;
  enemyScore: number;
  onContinue: () => void;
}

// Generate confetti/particle colors
const victoryColors = ['#4caf50', '#66bb6a', '#81c784', '#ffd700', '#ffeb3b', '#fff'];
const defeatColors = ['#f44336', '#ef5350', '#e57373', '#9e9e9e', '#757575', '#424242'];

function generateParticles(count: number, isVictory: boolean): Particle[] {
  const colors = isVictory ? victoryColors : defeatColors;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20, // Start near center
    y: 50,
    size: 4 + Math.random() * 8,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    velocityX: (Math.random() - 0.5) * 200,
    velocityY: -100 - Math.random() * 150,
    delay: Math.random() * 0.3,
  }));
}

export function VictoryBanner({
  isVictory,
  playerScore,
  enemyScore,
  onContinue,
}: VictoryBannerProps) {
  const theme = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles on mount
    setParticles(generateParticles(isVictory ? 40 : 20, isVictory));
  }, [isVictory]);

  const bannerColor = isVictory ? '#4caf50' : '#f44336';
  const bannerGlow = isVictory
    ? 'rgba(76, 175, 80, 0.6)'
    : 'rgba(244, 67, 54, 0.6)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* Particle explosion */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              scale: 0,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              left: `${particle.x + particle.velocityX / 5}%`,
              top: `${particle.y + particle.velocityY / 5 + 80}%`,
              scale: [0, 1.5, 1, 0.5],
              rotate: particle.rotation + 360,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: isVictory ? 1.5 : 1,
              delay: particle.delay,
              ease: [0.2, 0.8, 0.4, 1],
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: isVictory ? '2px' : '50%',
              boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* Main banner */}
      <motion.div
        initial={{ scale: 0, y: -50, rotateX: 90 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 20,
          delay: 0.1,
        }}
        style={{
          background: `linear-gradient(135deg, ${bannerColor} 0%, ${isVictory ? '#2e7d32' : '#c62828'} 100%)`,
          padding: '16px 48px',
          borderRadius: theme.radius.xl,
          boxShadow: `0 0 40px ${bannerGlow}, 0 8px 32px rgba(0,0,0,0.3)`,
          textAlign: 'center',
          pointerEvents: 'auto',
        }}
      >
        {/* Victory/Defeat text */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '2px',
            marginBottom: 8,
          }}
        >
          {isVictory ? '🎉 VICTORY! 🎉' : '💀 DEFEAT 💀'}
        </motion.div>

        {/* Score display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            fontSize: 20,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.95)',
          }}
        >
          <span style={{
            padding: '4px 12px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: theme.radius.md,
          }}>
            {playerScore}
          </span>
          <span style={{ opacity: 0.7 }}>vs</span>
          <span style={{
            padding: '4px 12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: theme.radius.md,
          }}>
            {enemyScore}
          </span>
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: 16,
            padding: '10px 32px',
            fontSize: theme.typography.fontSize.base,
            fontWeight: 700,
            background: 'rgba(255,255,255,0.95)',
            color: bannerColor,
            border: 'none',
            borderRadius: theme.radius.md,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          Continue
        </motion.button>
      </motion.div>

      {/* Radial glow behind banner */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0.3 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          background: `radial-gradient(circle, ${bannerGlow} 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: -1,
        }}
      />
    </motion.div>
  );
}
