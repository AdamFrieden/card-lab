import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { EncounterConfig, EncounterResult } from '../types/encounter';
import { EncounterSetupView } from './EncounterSetupView';
import { EncounterView } from './EncounterView';
import { useTheme } from '../theme';

type DemoView = 'setup' | 'encounter';

interface EncounterDemoViewProps {
  // Can add animationConfig later if needed
}

export function EncounterDemoView({}: EncounterDemoViewProps) {
  const theme = useTheme();
  const [currentView, setCurrentView] = useState<DemoView>('setup');
  const [encounterConfig, setEncounterConfig] = useState<EncounterConfig | null>(null);
  const [lastResult, setLastResult] = useState<EncounterResult | null>(null);

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
            <EncounterView
              config={encounterConfig}
              onComplete={handleEncounterComplete}
              onBack={handleBackToSetup}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
