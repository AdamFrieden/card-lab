import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme';
import type { EncounterConfig } from '../types/encounter';
import { ENEMY_LINEUPS, calculateLineupPower } from '../data/mockEncounterData';
import type { DifficultyLevel } from '../data/mockEncounterData';

interface EncounterSetupViewProps {
  onStartEncounter: (config: EncounterConfig) => void;
}

export function EncounterSetupView({ onStartEncounter }: EncounterSetupViewProps) {
  const theme = useTheme();
  const [playerSlotCount, setPlayerSlotCount] = useState(3);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  const enemyLineup = ENEMY_LINEUPS[difficulty];
  const enemyPower = calculateLineupPower(enemyLineup);

  const handleStart = () => {
    onStartEncounter({
      playerSlotCount,
      enemyCritters: [...enemyLineup],
    });
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      gap: '24px',
      overflowY: 'auto',
      overflowX: 'hidden',
      minHeight: 0,
      background: theme.colors.background.app,
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '10px',
        flexShrink: 0,
      }}>
        <h2 style={{
          color: theme.colors.text.primary,
          fontSize: '28px',
          margin: '0 0 8px 0',
          fontWeight: 700,
          letterSpacing: '-0.5px',
        }}>
          Encounter Setup
        </h2>
        <p style={{
          color: theme.colors.text.secondary,
          margin: 0,
          fontSize: '14px',
        }}>
          Configure your encounter parameters
        </p>
      </div>

      {/* Player Slots Selection */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: theme.colors.background.card,
        border: `2px solid ${theme.colors.border.default}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.card,
      }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.text.primary,
          fontWeight: 600,
        }}>
          Your Roster Size
        </h3>
        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
        }}>
          {[3, 4, 5].map(count => (
            <motion.button
              key={count}
              onClick={() => setPlayerSlotCount(count)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: theme.typography.fontSize.lg,
                fontWeight: 700,
                background: playerSlotCount === count
                  ? theme.colors.brand.primary
                  : theme.colors.background.panel,
                color: playerSlotCount === count
                  ? '#fff'
                  : theme.colors.text.primary,
                border: `2px solid ${playerSlotCount === count
                  ? theme.colors.brand.primary
                  : theme.colors.border.default}`,
                borderRadius: theme.radius.sm,
                cursor: 'pointer',
              }}
            >
              {count}
            </motion.button>
          ))}
        </div>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary,
        }}>
          {playerSlotCount} slots available for your critters
        </p>
      </div>

      {/* Difficulty Selection */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: theme.colors.background.card,
        border: `2px solid ${theme.colors.border.default}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.card,
      }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.text.primary,
          fontWeight: 600,
        }}>
          Enemy Difficulty
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: theme.spacing.sm,
        }}>
          {(['easy', 'medium', 'hard', 'brutal'] as DifficultyLevel[]).map(level => (
            <motion.button
              key={level}
              onClick={() => setDifficulty(level)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                flex: '1 1 45%',
                padding: '10px 16px',
                fontSize: theme.typography.fontSize.base,
                fontWeight: 600,
                textTransform: 'capitalize',
                background: difficulty === level
                  ? theme.colors.brand.primary
                  : theme.colors.background.panel,
                color: difficulty === level
                  ? '#fff'
                  : theme.colors.text.primary,
                border: `2px solid ${difficulty === level
                  ? theme.colors.brand.primary
                  : theme.colors.border.default}`,
                borderRadius: theme.radius.sm,
                cursor: 'pointer',
              }}
            >
              {level}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Enemy Preview */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: theme.colors.background.card,
        border: `2px solid ${theme.colors.border.default}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.card,
      }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.text.primary,
          fontWeight: 600,
        }}>
          Enemy Forces
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
        }}>
          {enemyLineup.map(enemy => (
            <div
              key={enemy.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.sm,
                background: theme.colors.background.app,
                borderRadius: theme.radius.sm,
                border: `1px solid ${theme.colors.border.subtle}`,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}>
                {enemy.image && (
                  <img
                    src={enemy.image}
                    alt={enemy.name}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: theme.radius.sm,
                      objectFit: 'cover',
                    }}
                  />
                )}
                <span style={{
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.primary,
                  fontWeight: 500,
                }}>
                  {enemy.name}
                </span>
              </div>
              <span style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                fontWeight: 700,
              }}>
                {enemy.level}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: theme.spacing.md,
          paddingTop: theme.spacing.md,
          borderTop: `1px solid ${theme.colors.border.subtle}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            fontWeight: 600,
          }}>
            Total Enemy Power
          </span>
          <span style={{
            fontSize: theme.typography.fontSize.xl,
            color: theme.colors.text.primary,
            fontWeight: 700,
          }}>
            {enemyPower}
          </span>
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        onClick={handleStart}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '16px 32px',
          fontSize: theme.typography.fontSize.lg,
          fontWeight: 700,
          background: theme.colors.brand.primaryGradient,
          color: '#fff',
          border: 'none',
          borderRadius: theme.radius.md,
          cursor: 'pointer',
          boxShadow: theme.shadows.button,
        }}
      >
        Start Encounter
      </motion.button>

      {/* Bottom spacing */}
      <div style={{ height: '20px', flexShrink: 0 }} />
    </div>
  );
}
