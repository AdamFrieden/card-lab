import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme';
import type { EncounterConfig, EncounterSlot, EncounterPhase, EncounterResult, FloatingLabel } from '../types/encounter';
import { MOCK_CRITTERS } from '../data/mockVillageData';
import type { VillageItem } from '../data/mockVillageData';
import {
  calculateSlotProjection,
  calculateTeamProjection,
  calculateEnemyTotal,
} from '../utils/encounterCalculations';
import { JuicyNumber } from '../components/encounter/JuicyNumber';
import { TickingNumber } from '../components/encounter/TickingNumber';
import { VictoryBanner } from '../components/encounter/VictoryBanner';
import { ScoreProgressBar } from '../components/encounter/ScoreProgressBar';
import { EncounterSlot as EncounterSlotComponent } from '../components/encounter/EncounterSlot';
import { useScreenShake } from '../hooks/useScreenShake';
import { useEncounterTimings } from '../contexts/EncounterTimingContext';
import type { EncounterAnimationSpeed } from '../config/encounterAnimationConfig';

// Roll a critter's power with ±25% variance
function rollCritterPower(basePower: number): number {
  const variance = Math.floor(basePower * 0.25);
  const roll = basePower + Math.floor(Math.random() * (variance * 2 + 1)) - variance;
  return Math.max(1, roll); // Minimum 1
}

interface EncounterViewProps {
  config: EncounterConfig;
  onComplete: (result: EncounterResult) => void;
  onBack: () => void;
}

export function EncounterView({ config, onComplete, onBack }: EncounterViewProps) {
  const theme = useTheme();
  const timings = useEncounterTimings();
  const { shakeStyle, triggerShake } = useScreenShake();

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
  const [finalPlayerScore, setFinalPlayerScore] = useState<number | null>(null);
  const [finalEnemyScore, setFinalEnemyScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const skipResolutionRef = useRef(false);

  // Floating trait labels
  const [floatingLabels, setFloatingLabels] = useState<FloatingLabel[]>([]);
  const labelIdRef = useRef(0);

  // Calculate projections
  const playerProjection = useMemo(
    () => calculateTeamProjection(playerSlots, playerSlots, enemySlots),
    [playerSlots, enemySlots]
  );

  const enemyTotal = useMemo(
    () => calculateEnemyTotal(enemySlots),
    [enemySlots]
  );

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

  // Add a floating label for trait activation
  const addFloatingLabel = useCallback((slotId: string, text: string, amount: number, color: 'green' | 'red' | 'gold') => {
    const id = `label-${labelIdRef.current++}`;
    setFloatingLabels(prev => [...prev, { id, slotId, text, amount, color }]);
    // Auto-remove after animation completes
    setTimeout(() => {
      setFloatingLabels(prev => prev.filter(l => l.id !== id));
    }, timings.floatingLabelDuration + timings.floatingLabelRemoveBuffer);
  }, [timings]);

  // Resolution animation
  const runResolution = useCallback(async () => {
    setPhase('resolving');
    skipResolutionRef.current = false;
    setFloatingLabels([]);

    let currentPlayerScore = 0;
    let currentEnemyScore = 0;
    let actualPlayerTotal = 0;
    let actualEnemyTotal = 0;

    // Animate through player critters
    for (let i = 0; i < playerSlots.length; i++) {
      if (skipResolutionRef.current) break;

      const slot = playerSlots[i];
      if (slot.critter) {
        setResolutionStep(i + 1);
        const projection = calculateSlotProjection(slot, playerSlots, enemySlots);

        // Roll with variance! ±25%
        const baseValue = slot.critter.level || 0;
        const rolledValue = rollCritterPower(baseValue);
        const rollDiff = rolledValue - baseValue;

        currentPlayerScore += rolledValue;
        actualPlayerTotal += rolledValue;
        setAnimatingPlayerScore(currentPlayerScore);

        // Show roll result with color based on luck
        if (rollDiff !== 0) {
          addFloatingLabel(
            slot.id,
            rollDiff > 0 ? 'Lucky roll!' : 'Unlucky...',
            rollDiff,
            rollDiff > 0 ? 'gold' : 'red'
          );
          if (rollDiff > 0) {
            triggerShake({ intensity: 4, duration: timings.shakeMedium });
          } else {
            triggerShake({ intensity: 2, duration: timings.shakeLight });
          }
        } else {
          triggerShake({ intensity: 2, duration: timings.shakeLight });
        }

        await new Promise(resolve => setTimeout(resolve, timings.rollDelay));
        if (skipResolutionRef.current) break;

        // Then show each trait bonus with floating label
        for (const bonus of projection.bonuses) {
          if (skipResolutionRef.current) break;

          addFloatingLabel(slot.id, bonus.description, bonus.amount, 'green');
          currentPlayerScore += bonus.amount;
          actualPlayerTotal += bonus.amount;
          setAnimatingPlayerScore(currentPlayerScore);
          triggerShake({ intensity: 4, duration: timings.shakeMedium });

          await new Promise(resolve => setTimeout(resolve, timings.traitBonusDelay));
        }

        // Brief pause between critters
        await new Promise(resolve => setTimeout(resolve, timings.critterPauseDelay));
      }
    }

    // Animate through enemy critters
    for (let i = 0; i < enemySlots.length; i++) {
      if (skipResolutionRef.current) break;

      const slot = enemySlots[i];
      if (slot.critter) {
        setResolutionStep(playerSlots.length + i + 1);

        // Enemies also roll with variance!
        const baseValue = slot.critter.level || 0;
        const rolledValue = rollCritterPower(baseValue);

        currentEnemyScore += rolledValue;
        actualEnemyTotal += rolledValue;
        setAnimatingEnemyScore(currentEnemyScore);
        triggerShake({ intensity: 2, duration: timings.shakeLight });
        await new Promise(resolve => setTimeout(resolve, timings.enemyRollDelay));
      }
    }

    // Store final actual scores
    setFinalPlayerScore(actualPlayerTotal);
    setFinalEnemyScore(actualEnemyTotal);

    // Show final result
    if (!skipResolutionRef.current) {
      await new Promise(resolve => setTimeout(resolve, timings.finalRevealDelay));
    }

    // Final reveal with appropriate shake
    if (actualPlayerTotal >= actualEnemyTotal) {
      triggerShake({ intensity: 6, duration: timings.shakeVictory, decay: 0.85 });
    } else {
      triggerShake({ intensity: 10, duration: timings.shakeDefeat, decay: 0.8 });
    }

    setShowResult(true);
    setPhase('result');
  }, [playerSlots, enemySlots, addFloatingLabel, triggerShake, timings]);

  // Skip resolution - still need to roll dice for final result
  const handleSkip = useCallback(() => {
    if (phase === 'resolving') {
      skipResolutionRef.current = true;
      setFloatingLabels([]);

      // Roll all remaining critters instantly
      let actualPlayer = animatingPlayerScore;
      let actualEnemy = animatingEnemyScore;

      // Roll any unresolved player critters
      for (let i = resolutionStep; i <= playerSlots.length; i++) {
        const slot = playerSlots[i - 1];
        if (slot?.critter) {
          const projection = calculateSlotProjection(slot, playerSlots, enemySlots);
          actualPlayer += rollCritterPower(slot.critter.level || 0);
          actualPlayer += projection.bonuses.reduce((sum, b) => sum + b.amount, 0);
        }
      }

      // Roll any unresolved enemy critters
      const enemyStartIdx = Math.max(0, resolutionStep - playerSlots.length);
      for (let i = enemyStartIdx; i < enemySlots.length; i++) {
        const slot = enemySlots[i];
        if (slot?.critter) {
          actualEnemy += rollCritterPower(slot.critter.level || 0);
        }
      }

      setAnimatingPlayerScore(actualPlayer);
      setAnimatingEnemyScore(actualEnemy);
      setFinalPlayerScore(actualPlayer);
      setFinalEnemyScore(actualEnemy);

      if (actualPlayer >= actualEnemy) {
        triggerShake({ intensity: 6, duration: timings.shakeVictory, decay: 0.85 });
      } else {
        triggerShake({ intensity: 10, duration: timings.shakeDefeat, decay: 0.8 });
      }

      setShowResult(true);
      setPhase('result');
    }
  }, [phase, animatingPlayerScore, animatingEnemyScore, resolutionStep, playerSlots, enemySlots, triggerShake, timings]);

  // Handle continue after result
  const handleContinue = useCallback(() => {
    const actualPlayer = finalPlayerScore ?? playerProjection;
    const actualEnemy = finalEnemyScore ?? enemyTotal;
    const result: EncounterResult = {
      playerScore: actualPlayer,
      enemyScore: actualEnemy,
      victory: actualPlayer >= actualEnemy,
    };
    onComplete(result);
  }, [finalPlayerScore, finalEnemyScore, playerProjection, enemyTotal, onComplete]);

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
        ...shakeStyle,
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
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              fontWeight: 600,
              marginBottom: 4,
            }}>
              YOUR TEAM
            </div>
            <TickingNumber
              value={phase === 'resolving' || phase === 'result' ? animatingPlayerScore : playerProjection}
              size="xl"
              color={showResult && (finalPlayerScore ?? 0) >= (finalEnemyScore ?? 0) ? '#4caf50' : theme.colors.text.primary}
              glowColor={showResult && (finalPlayerScore ?? 0) >= (finalEnemyScore ?? 0) ? 'rgba(76, 175, 80, 0.5)' : undefined}
              duration={timings.tickingNumberDuration}
            />
            {/* Progress bar */}
            {(phase === 'resolving' || phase === 'result') && (
              <div style={{ marginTop: 8 }}>
                <ScoreProgressBar
                  current={animatingPlayerScore}
                  projection={playerProjection}
                  side="player"
                  isComplete={phase === 'result'}
                />
              </div>
            )}
          </div>

          {/* Diff indicator */}
          <div style={{
            textAlign: 'center',
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            background: diff >= 0
              ? 'rgba(76, 175, 80, 0.15)'
              : 'rgba(244, 67, 54, 0.15)',
            borderRadius: theme.radius.md,
            minWidth: 60,
          }}>
            <JuicyNumber
              value={phase === 'resolving' || phase === 'result'
                ? animatingPlayerScore - animatingEnemyScore
                : diff}
              size="md"
              color={diff >= 0 ? '#4caf50' : '#f44336'}
              accentColor={diff >= 0 ? '#66bb6a' : '#ef5350'}
              showSign
            />
          </div>

          {/* Enemy projection */}
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              fontWeight: 600,
              marginBottom: 4,
            }}>
              ENEMY
            </div>
            <TickingNumber
              value={phase === 'resolving' || phase === 'result' ? animatingEnemyScore : enemyTotal}
              size="xl"
              color={showResult && (finalPlayerScore ?? 0) < (finalEnemyScore ?? 0) ? '#f44336' : theme.colors.text.primary}
              glowColor={showResult && (finalPlayerScore ?? 0) < (finalEnemyScore ?? 0) ? 'rgba(244, 67, 54, 0.5)' : undefined}
              duration={timings.tickingNumberDuration}
            />
            {/* Progress bar */}
            {(phase === 'resolving' || phase === 'result') && (
              <div style={{ marginTop: 8 }}>
                <ScoreProgressBar
                  current={animatingEnemyScore}
                  projection={enemyTotal}
                  side="enemy"
                  isComplete={phase === 'result'}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Battle Area - Two Columns */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflowY: 'auto',
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
      }}>
        {/* Player Column */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
        }}>
          {/* Column Header Badge */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: theme.spacing.xs,
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              background: 'rgba(76, 175, 80, 0.1)',
              borderRadius: theme.radius.md,
              border: '1px solid rgba(76, 175, 80, 0.2)',
            }}>
              Allies
            </div>
          </div>
          {playerSlots.map((slot, index) => (
            <EncounterSlotComponent
              key={slot.id}
              slot={slot}
              index={index}
              projection={calculateSlotProjection(slot, playerSlots, enemySlots)}
              isHighlighted={phase === 'resolving' && resolutionStep === index + 1}
              floatingLabels={floatingLabels}
              onSlotClick={handleSlotClick}
              phase={phase}
              timings={timings}
              side="player"
              selectedCritterId={selectedCritterId}
            />
          ))}
        </div>

        {/* Center Divider */}
        <div style={{
          width: 2,
          background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.border.subtle} 20%, ${theme.colors.border.subtle} 80%, transparent 100%)`,
          flexShrink: 0,
          margin: `${theme.spacing.xl} 0`,
        }} />

        {/* Enemy Column */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
        }}>
          {/* Column Header Badge */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: theme.spacing.xs,
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              background: 'rgba(244, 67, 54, 0.1)',
              borderRadius: theme.radius.md,
              border: '1px solid rgba(244, 67, 54, 0.2)',
            }}>
              Enemies
            </div>
          </div>
          {enemySlots.map((slot, index) => (
            <EncounterSlotComponent
              key={slot.id}
              slot={slot}
              index={index}
              projection={{ baseValue: slot.critter?.level || 0, bonuses: [], totalValue: slot.critter?.level || 0 }}
              isHighlighted={phase === 'resolving' && resolutionStep === playerSlots.length + index + 1}
              floatingLabels={[]}
              onSlotClick={() => {}}
              phase={phase}
              timings={timings}
              side="enemy"
            />
          ))}
        </div>
      </div>

      {/* Card Hand - Semi-transparent with blur */}
      <div style={{
        background: 'rgba(245, 230, 211, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderTop: `1px solid rgba(212, 196, 176, 0.5)`,
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          gap: theme.spacing.md,
          overflowX: 'auto',
          paddingBottom: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
        }}>
          {playerHand.map((critter, index) => {
            const isSelected = selectedCritterId === critter.id;
            const hasTrait = !!critter.trait;

            return (
              <motion.div
                key={critter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: isSelected ? -10 : 0,
                  scale: isSelected ? 1.05 : 1,
                }}
                transition={{ delay: index * timings.cardEntranceDelay, duration: timings.cardEntranceDuration }}
                onClick={() => handleHandClick(critter.id)}
                whileHover={phase === 'rostering' ? { scale: 1.08, y: -6 } : {}}
                whileTap={phase === 'rostering' ? { scale: 0.95 } : {}}
                style={{
                  flexShrink: 0,
                  width: 100,
                  background: `linear-gradient(145deg, ${theme.colors.background.card} 0%, #efe5d8 100%)`,
                  borderRadius: theme.radius.lg,
                  padding: theme.spacing.sm,
                  cursor: phase === 'rostering' ? 'pointer' : 'default',
                  textAlign: 'center',
                  boxShadow: isSelected
                    ? `0 8px 20px rgba(0,0,0,0.15), 0 0 0 2px ${theme.colors.brand.primary}`
                    : '0 3px 10px rgba(0,0,0,0.1)',
                  position: 'relative',
                }}
              >
                {/* Trait indicator dot */}
                {hasTrait && (
                  <div style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#4caf50',
                    boxShadow: '0 0 4px rgba(76, 175, 80, 0.5)',
                  }} />
                )}
                {critter.image && (
                  <img
                    src={critter.image}
                    alt={critter.name}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: theme.radius.md,
                      objectFit: 'cover',
                      marginBottom: 6,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                )}
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: 600,
                  color: theme.colors.text.primary,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: 2,
                }}>
                  {critter.name}
                </div>
                {/* Trait text - truncated */}
                {hasTrait && (
                  <div style={{
                    fontSize: '10px',
                    color: theme.colors.text.secondary,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: 4,
                    lineHeight: 1.2,
                  }}>
                    {critter.trait!.text}
                  </div>
                )}
                {/* Power badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px 8px',
                  background: 'rgba(139, 115, 85, 0.15)',
                  borderRadius: theme.radius.sm,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: 700,
                  color: theme.colors.brand.primary,
                }}>
                  {critter.level}
                </div>
              </motion.div>
            );
          })}
          {playerHand.length === 0 && (
            <div style={{
              color: theme.colors.text.tertiary,
              fontSize: theme.typography.fontSize.sm,
              fontStyle: 'italic',
              padding: theme.spacing.lg,
              textAlign: 'center',
              width: '100%',
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
        background: 'rgba(245, 230, 211, 0.9)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
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

      {/* Victory/Defeat Banner - Non-blocking overlay */}
      <AnimatePresence>
        {showResult && finalPlayerScore !== null && finalEnemyScore !== null && (
          <VictoryBanner
            isVictory={finalPlayerScore >= finalEnemyScore}
            playerScore={finalPlayerScore}
            enemyScore={finalEnemyScore}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
