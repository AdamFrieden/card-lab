import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { EncounterConfig, EncounterResult } from '../types/encounter';
import { EncounterSetupView } from './EncounterSetupView';
import { EncounterView } from './EncounterView';
import { useTheme } from '../theme';
import type { EncounterAnimationSpeed } from '../config/encounterAnimationConfig';
import { EncounterTimingProvider } from '../contexts/EncounterTimingContext';

type DemoView = 'setup' | 'encounter';

interface EncounterDemoViewProps {
  // Can add animationConfig later if needed
}

export function EncounterDemoView({}: EncounterDemoViewProps) {
  const theme = useTheme();
  const [currentView, setCurrentView] = useState<DemoView>('setup');
  const [encounterConfig, setEncounterConfig] = useState<EncounterConfig | null>(null);
  const [lastResult, setLastResult] = useState<EncounterResult | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState<EncounterAnimationSpeed>('medium');

  const handleStartEncounter = (config: EncounterConfig) => {
    setEncounterConfig(config);
    setCurrentView('encounter');
  };

  const handleEncounterComplete = (result: EncounterResult) => {
    setLastResult(result);
    setCurrentView('setup');
  };

  const handleBackToSetup = () => {
    setCurrentView('setup');
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Animation Speed Selector - Floating top-right
      <div style={{
        position: 'absolute',
        top: theme.spacing.md,
        right: theme.spacing.md,
        zIndex: 10,
        display: 'flex',
        gap: theme.spacing.xs,
        background: theme.colors.background.card,
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.border.default}`,
        boxShadow: theme.shadows.card,
      }}>
        {(['slow', 'medium', 'fast', 'instant'] as EncounterAnimationSpeed[]).map((speed) => (
          <motion.button
            key={speed}
            onClick={() => setAnimationSpeed(speed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: 600,
              textTransform: 'capitalize',
              background: animationSpeed === speed
                ? theme.colors.brand.primary
                : 'transparent',
              color: animationSpeed === speed
                ? '#fff'
                : theme.colors.text.secondary,
              border: 'none',
              borderRadius: theme.radius.sm,
              cursor: 'pointer',
            }}
          >
            {speed}
          </motion.button>
        ))}
      </div> */}

      <AnimatePresence mode="wait">
        {currentView === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <EncounterSetupView onStartEncounter={handleStartEncounter} />

            {/* Last Result Banner */}
            {lastResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  bottom: 100,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: lastResult.victory
                    ? 'rgba(76, 175, 80, 0.9)'
                    : 'rgba(244, 67, 54, 0.9)',
                  color: '#fff',
                  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                  borderRadius: theme.radius.md,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: 600,
                  boxShadow: theme.shadows.card,
                }}
              >
                Last: {lastResult.victory ? 'Victory' : 'Defeat'} ({lastResult.playerScore} vs {lastResult.enemyScore})
              </motion.div>
            )}
          </motion.div>
        )}

        {currentView === 'encounter' && encounterConfig && (
          <motion.div
            key="encounter"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <EncounterTimingProvider speed={animationSpeed}>
              <EncounterView
                config={encounterConfig}
                onComplete={handleEncounterComplete}
                onBack={handleBackToSetup}
              />
            </EncounterTimingProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
