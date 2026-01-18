import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useTheme } from '../theme';
import type { EncounterConfig, EncounterSlot, EncounterPhase, EncounterResult } from '../types/encounter';
import { MOCK_CRITTERS } from '../data/mockVillageData';
import type { VillageItem } from '../data/mockVillageData';
import {
  calculateSlotProjection,
  calculateTeamProjection,
  calculateEnemyTotal,
  getAllTraitBonuses,
} from '../utils/encounterCalculations';

interface EncounterViewProps {
  config: EncounterConfig;
  onComplete: (result: EncounterResult) => void;
  onBack: () => void;
}

export function EncounterView({ config, onComplete, onBack }: EncounterViewProps) {
  const theme = useTheme();

  // Initialize slots
  const initialPlayerSlots: EncounterSlot[] = Array.from(
    { length: config.playerSlotCount },
    (_, i) => ({
      id: `player-${i}`,
      critter: null,
      position: i,
      side: 'player' as const,
    })
  );

  const initialEnemySlots: EncounterSlot[] = config.enemyCritters.map((critter, i) => ({
    id: `enemy-${i}`,
    critter,
    position: i,
    side: 'enemy' as const,
  }));

  // State
  const [phase, setPhase] = useState<EncounterPhase>('rostering');
  const [playerSlots, setPlayerSlots] = useState<EncounterSlot[]>(initialPlayerSlots);
  const [enemySlots] = useState<EncounterSlot[]>(initialEnemySlots);
  const [playerHand, setPlayerHand] = useState<VillageItem[]>(
    MOCK_CRITTERS.filter(c => !c.isExhausted)
  );
  const [selectedCritterId, setSelectedCritterId] = useState<string | null>(null);

  // Resolution animation state
  const [resolutionStep, setResolutionStep] = useState(0);
  const [animatingPlayerScore, setAnimatingPlayerScore] = useState(0);
  const [animatingEnemyScore, setAnimatingEnemyScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const skipResolutionRef = useRef(false);

  // Calculate projections
  const playerProjection = useMemo(
    () => calculateTeamProjection(playerSlots, playerSlots, enemySlots),
    [playerSlots, enemySlots]
  );

  const enemyTotal = useMemo(
    () => calculateEnemyTotal(enemySlots),
    [enemySlots]
  );

  // Animated projection values
  const playerSpring = useSpring(playerProjection, { stiffness: 300, damping: 30 });
  const enemySpring = useSpring(enemyTotal, { stiffness: 300, damping: 30 });

  // Update spring targets when projections change
  useEffect(() => {
    playerSpring.set(playerProjection);
  }, [playerProjection, playerSpring]);

  useEffect(() => {
    enemySpring.set(enemyTotal);
  }, [enemyTotal, enemySpring]);

  // Roster a critter into a slot
  const rosterCritter = useCallback((slotId: string, critter: VillageItem) => {
    setPlayerSlots(slots =>
      slots.map(slot =>
        slot.id === slotId ? { ...slot, critter } : slot
      )
    );
    setPlayerHand(hand => hand.filter(c => c.id !== critter.id));
    setSelectedCritterId(null);
  }, []);

  // Unroster a critter from a slot
  const unrosterCritter = useCallback((slotId: string) => {
    const slot = playerSlots.find(s => s.id === slotId);
    if (slot?.critter) {
      setPlayerHand(hand => [...hand, slot.critter!]);
      setPlayerSlots(slots =>
        slots.map(s => (s.id === slotId ? { ...s, critter: null } : s))
      );
    }
  }, [playerSlots]);

  // Handle slot click
  const handleSlotClick = useCallback((slotId: string) => {
    if (phase !== 'rostering') return;

    const slot = playerSlots.find(s => s.id === slotId);
    if (!slot) return;

    if (slot.critter) {
      // Unroster if slot is filled
      unrosterCritter(slotId);
    } else if (selectedCritterId) {
      // Roster selected critter
      const critter = playerHand.find(c => c.id === selectedCritterId);
      if (critter) {
        rosterCritter(slotId, critter);
      }
    }
  }, [phase, playerSlots, selectedCritterId, playerHand, rosterCritter, unrosterCritter]);

  // Handle hand card click
  const handleHandClick = useCallback((critterId: string) => {
    if (phase !== 'rostering') return;

    if (selectedCritterId === critterId) {
      setSelectedCritterId(null);
    } else {
      setSelectedCritterId(critterId);
    }
  }, [phase, selectedCritterId]);

  // Resolution animation
  const runResolution = useCallback(async () => {
    setPhase('resolving');
    skipResolutionRef.current = false;

    const traitBonuses = getAllTraitBonuses(playerSlots, enemySlots);
    let currentPlayerScore = 0;
    let currentEnemyScore = 0;

    // Animate through player critters
    for (let i = 0; i < playerSlots.length; i++) {
      if (skipResolutionRef.current) break;

      const slot = playerSlots[i];
      if (slot.critter) {
        setResolutionStep(i + 1);
        const projection = calculateSlotProjection(slot, playerSlots, enemySlots);
        currentPlayerScore += projection.totalValue;
        setAnimatingPlayerScore(currentPlayerScore);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    // Animate through enemy critters
    for (let i = 0; i < enemySlots.length; i++) {
      if (skipResolutionRef.current) break;

      const slot = enemySlots[i];
      if (slot.critter) {
        setResolutionStep(playerSlots.length + i + 1);
        currentEnemyScore += slot.critter.level || 0;
        setAnimatingEnemyScore(currentEnemyScore);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    // Show final result
    if (!skipResolutionRef.current) {
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    setAnimatingPlayerScore(playerProjection);
    setAnimatingEnemyScore(enemyTotal);
    setShowResult(true);
    setPhase('result');
  }, [playerSlots, enemySlots, playerProjection, enemyTotal]);

  // Skip resolution
  const handleSkip = useCallback(() => {
    if (phase === 'resolving') {
      skipResolutionRef.current = true;
      setAnimatingPlayerScore(playerProjection);
      setAnimatingEnemyScore(enemyTotal);
      setShowResult(true);
      setPhase('result');
    }
  }, [phase, playerProjection, enemyTotal]);

  // Handle continue after result
  const handleContinue = useCallback(() => {
    const result: EncounterResult = {
      playerScore: playerProjection,
      enemyScore: enemyTotal,
      victory: playerProjection >= enemyTotal,
    };
    onComplete(result);
  }, [playerProjection, enemyTotal, onComplete]);

  const hasRosteredCritters = playerSlots.some(s => s.critter !== null);
  const diff = playerProjection - enemyTotal;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: theme.colors.background.app,
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={phase === 'resolving' ? handleSkip : undefined}
    >
      {/* Header with projections */}
      <div style={{
        padding: theme.spacing.lg,
        background: theme.colors.background.card,
        borderBottom: `2px solid ${theme.colors.border.default}`,
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 500,
          margin: '0 auto',
        }}>
          {/* Player projection */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              fontWeight: 600,
              marginBottom: 4,
            }}>
              YOUR TEAM
            </div>
            <motion.div
              key={phase === 'resolving' ? animatingPlayerScore : playerProjection}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              style={{
                fontSize: theme.typography.fontSize.xxxl,
                color: theme.colors.text.primary,
                fontWeight: 700,
              }}
            >
              {phase === 'resolving' || phase === 'result' ? animatingPlayerScore : playerProjection}
            </motion.div>
          </div>

          {/* Diff indicator */}
          <div style={{
            textAlign: 'center',
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            background: diff >= 0
              ? 'rgba(76, 175, 80, 0.15)'
              : 'rgba(244, 67, 54, 0.15)',
            borderRadius: theme.radius.md,
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: 700,
              color: diff >= 0 ? '#4caf50' : '#f44336',
            }}>
              {diff >= 0 ? '+' : ''}{diff}
            </div>
          </div>

          {/* Enemy projection */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              fontWeight: 600,
              marginBottom: 4,
            }}>
              ENEMY
            </div>
            <motion.div
              key={phase === 'resolving' ? animatingEnemyScore : enemyTotal}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              style={{
                fontSize: theme.typography.fontSize.xxxl,
                color: theme.colors.text.primary,
                fontWeight: 700,
              }}
            >
              {phase === 'resolving' || phase === 'result' ? animatingEnemyScore : enemyTotal}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Battle Area - Two Columns */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflowY: 'auto',
        padding: theme.spacing.md,
        gap: theme.spacing.md,
      }}>
        {/* Player Column */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.md,
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontWeight: 600,
            textAlign: 'center',
            padding: theme.spacing.sm,
          }}>
            YOUR SLOTS
          </div>
          {playerSlots.map((slot, index) => {
            const projection = calculateSlotProjection(slot, playerSlots, enemySlots);
            const isHighlighted = phase === 'resolving' && resolutionStep === index + 1;

            return (
              <motion.div
                key={slot.id}
                onClick={() => handleSlotClick(slot.id)}
                whileHover={phase === 'rostering' ? { scale: 1.02 } : {}}
                whileTap={phase === 'rostering' ? { scale: 0.98 } : {}}
                animate={{
                  boxShadow: isHighlighted
                    ? '0 0 20px rgba(76, 175, 80, 0.5)'
                    : theme.shadows.card,
                }}
                style={{
                  background: theme.colors.background.card,
                  border: `2px solid ${
                    slot.critter
                      ? theme.colors.border.strong
                      : selectedCritterId
                        ? theme.colors.brand.primary
                        : theme.colors.border.default
                  }`,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.md,
                  minHeight: 80,
                  cursor: phase === 'rostering' ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.xs,
                }}
              >
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
                        {slot.critter.trait && (
                          <div style={{
                            fontSize: theme.typography.fontSize.xs,
                            color: theme.colors.text.secondary,
                          }}>
                            {slot.critter.trait.text}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Projection badge */}
                    <motion.div
                      key={projection.totalValue}
                      initial={{ scale: 1.4 }}
                      animate={{ scale: 1 }}
                      style={{
                        alignSelf: 'flex-end',
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        background: projection.bonuses.length > 0
                          ? 'rgba(76, 175, 80, 0.2)'
                          : theme.colors.background.app,
                        borderRadius: theme.radius.sm,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: 700,
                        color: projection.bonuses.length > 0
                          ? '#4caf50'
                          : theme.colors.text.primary,
                      }}
                    >
                      {projection.totalValue}
                      {projection.bonuses.length > 0 && (
                        <span style={{ fontWeight: 400, marginLeft: 4 }}>
                          (+{projection.bonuses.reduce((s, b) => s + b.amount, 0)})
                        </span>
                      )}
                    </motion.div>
                  </>
                ) : (
                  <div style={{
                    color: theme.colors.text.tertiary,
                    fontSize: theme.typography.fontSize.sm,
                    fontStyle: 'italic',
                  }}>
                    {selectedCritterId ? 'Tap to assign' : 'Empty slot'}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Enemy Column */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.md,
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontWeight: 600,
            textAlign: 'center',
            padding: theme.spacing.sm,
          }}>
            ENEMY SLOTS
          </div>
          {enemySlots.map((slot, index) => {
            const isHighlighted = phase === 'resolving' &&
              resolutionStep === playerSlots.length + index + 1;

            return (
              <motion.div
                key={slot.id}
                animate={{
                  boxShadow: isHighlighted
                    ? '0 0 20px rgba(244, 67, 54, 0.5)'
                    : theme.shadows.card,
                }}
                style={{
                  background: theme.colors.background.card,
                  border: `2px solid ${theme.colors.border.strong}`,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.md,
                  minHeight: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.xs,
                }}
              >
                {slot.critter && (
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
                      </div>
                    </div>
                    {/* Power badge */}
                    <div style={{
                      alignSelf: 'flex-end',
                      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                      background: 'rgba(244, 67, 54, 0.15)',
                      borderRadius: theme.radius.sm,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: 700,
                      color: '#f44336',
                    }}>
                      {slot.critter.level}
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Card Hand */}
      <div style={{
        background: theme.colors.background.panel,
        borderTop: `2px solid ${theme.colors.border.default}`,
        padding: theme.spacing.md,
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary,
          fontWeight: 600,
          marginBottom: theme.spacing.sm,
        }}>
          Your Critters ({playerHand.length})
        </div>
        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
          overflowX: 'auto',
          paddingBottom: theme.spacing.sm,
        }}>
          {playerHand.map(critter => (
            <motion.div
              key={critter.id}
              onClick={() => handleHandClick(critter.id)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: selectedCritterId === critter.id ? -8 : 0,
                boxShadow: selectedCritterId === critter.id
                  ? theme.shadows.cardSelected
                  : theme.shadows.card,
              }}
              style={{
                flexShrink: 0,
                width: 80,
                background: theme.colors.background.card,
                border: `2px solid ${
                  selectedCritterId === critter.id
                    ? theme.colors.brand.primary
                    : theme.colors.border.default
                }`,
                borderRadius: theme.radius.md,
                padding: theme.spacing.sm,
                cursor: phase === 'rostering' ? 'pointer' : 'default',
                textAlign: 'center',
              }}
            >
              {critter.image && (
                <img
                  src={critter.image}
                  alt={critter.name}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: theme.radius.sm,
                    objectFit: 'cover',
                    marginBottom: 4,
                  }}
                />
              )}
              <div style={{
                fontSize: theme.typography.fontSize.xs,
                fontWeight: 600,
                color: theme.colors.text.primary,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {critter.name}
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.xs,
                fontWeight: 700,
                color: theme.colors.brand.primary,
              }}>
                {critter.level}
              </div>
            </motion.div>
          ))}
          {playerHand.length === 0 && (
            <div style={{
              color: theme.colors.text.tertiary,
              fontSize: theme.typography.fontSize.sm,
              fontStyle: 'italic',
              padding: theme.spacing.md,
            }}>
              All critters rostered
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
        background: theme.colors.background.panel,
        display: 'flex',
        gap: theme.spacing.md,
        flexShrink: 0,
      }}>
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: theme.typography.fontSize.base,
            fontWeight: 600,
            background: theme.colors.background.card,
            color: theme.colors.text.primary,
            border: `2px solid ${theme.colors.border.default}`,
            borderRadius: theme.radius.md,
            cursor: 'pointer',
          }}
        >
          Back
        </motion.button>
        <motion.button
          onClick={phase === 'rostering' ? runResolution : handleContinue}
          disabled={phase === 'rostering' && !hasRosteredCritters}
          whileHover={hasRosteredCritters || phase !== 'rostering' ? { scale: 1.02 } : {}}
          whileTap={hasRosteredCritters || phase !== 'rostering' ? { scale: 0.98 } : {}}
          style={{
            flex: 2,
            padding: '12px 16px',
            fontSize: theme.typography.fontSize.lg,
            fontWeight: 700,
            background: (phase === 'rostering' && !hasRosteredCritters)
              ? theme.colors.border.default
              : theme.colors.brand.primaryGradient,
            color: '#fff',
            border: 'none',
            borderRadius: theme.radius.md,
            cursor: (phase === 'rostering' && !hasRosteredCritters) ? 'not-allowed' : 'pointer',
            opacity: (phase === 'rostering' && !hasRosteredCritters) ? 0.5 : 1,
          }}
        >
          {phase === 'rostering' ? 'GO!' : phase === 'resolving' ? 'Tap to skip...' : 'Continue'}
        </motion.button>
      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: theme.zIndex.overlay,
            }}
            onClick={handleContinue}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                background: theme.colors.background.card,
                borderRadius: theme.radius.xl,
                padding: theme.spacing.xxl,
                textAlign: 'center',
                boxShadow: theme.shadows.cardHover,
                minWidth: 280,
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: theme.spacing.md,
              }}>
                {playerProjection >= enemyTotal ? '🎉' : '💀'}
              </div>
              <h2 style={{
                margin: 0,
                fontSize: theme.typography.fontSize.xxl,
                fontWeight: 700,
                color: playerProjection >= enemyTotal ? '#4caf50' : '#f44336',
                marginBottom: theme.spacing.md,
              }}>
                {playerProjection >= enemyTotal ? 'Victory!' : 'Defeat'}
              </h2>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: theme.spacing.xl,
                marginBottom: theme.spacing.lg,
              }}>
                <div>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                  }}>
                    You
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xxl,
                    fontWeight: 700,
                    color: theme.colors.text.primary,
                  }}>
                    {playerProjection}
                  </div>
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.xl,
                  color: theme.colors.text.tertiary,
                  alignSelf: 'center',
                }}>
                  vs
                </div>
                <div>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                  }}>
                    Enemy
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xxl,
                    fontWeight: 700,
                    color: theme.colors.text.primary,
                  }}>
                    {enemyTotal}
                  </div>
                </div>
              </div>
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '12px 32px',
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: 600,
                  background: theme.colors.brand.primaryGradient,
                  color: '#fff',
                  border: 'none',
                  borderRadius: theme.radius.md,
                  cursor: 'pointer',
                }}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
