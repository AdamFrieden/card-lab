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
import { TickingNumber } from '../components/encounter/TickingNumber';
import { VictoryBanner } from '../components/encounter/VictoryBanner';
import { ScoreProgressBar } from '../components/encounter/ScoreProgressBar';
import { EncounterSlot as EncounterSlotComponent } from '../components/encounter/EncounterSlot';
import { useScreenShake } from '../hooks/useScreenShake';
import { useEncounterTimings } from '../contexts/EncounterTimingContext';

// Roll a critter's power with ±50% variance
function rollCritterPower(basePower: number): number {
  const variance = Math.floor(basePower * 0.7);
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

        // Wait a moment for highlight to be visible before rolling
        await new Promise(resolve => setTimeout(resolve, timings.rollDelay));
        if (skipResolutionRef.current) break;

        const projection = calculateSlotProjection(slot, playerSlots, enemySlots);

        // Roll with variance! ±25%
        const baseValue = slot.critter.level || 0;
        const rolledValue = rollCritterPower(baseValue);
        const rollDiff = rolledValue - baseValue;

        currentPlayerScore += rolledValue;
        actualPlayerTotal += rolledValue;
        setAnimatingPlayerScore(currentPlayerScore);

        // Always show roll result with color based on luck
        let rollColor: 'green' | 'red' | 'gold' = 'gold';
        if (rollDiff > 0) {
          rollColor = 'green'; // Lucky roll
        } else if (rollDiff < 0) {
          rollColor = 'red'; // Unlucky roll
        }

        addFloatingLabel(
          slot.id,
          '', // Empty text - we only want to show the number
          rolledValue,
          rollColor
        );

        await new Promise(resolve => setTimeout(resolve, timings.rollDelay / 2));
        if (skipResolutionRef.current) break;

        // Then show each trait bonus with floating label (no shake for player)
        for (const bonus of projection.bonuses) {
          if (skipResolutionRef.current) break;

          currentPlayerScore += bonus.amount;
          actualPlayerTotal += bonus.amount;
          setAnimatingPlayerScore(currentPlayerScore);

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

        // Wait a moment for highlight to be visible before rolling
        await new Promise(resolve => setTimeout(resolve, timings.rollDelay));
        if (skipResolutionRef.current) break;

        // Enemies also roll with variance!
        const baseValue = slot.critter.level || 0;
        const rolledValue = rollCritterPower(baseValue);
        const rollDiff = rolledValue - baseValue;

        currentEnemyScore += rolledValue;
        actualEnemyTotal += rolledValue;
        setAnimatingEnemyScore(currentEnemyScore);

        // Always show roll result with color based on luck
        let rollColor: 'green' | 'red' | 'gold' = 'gold';
        if (rollDiff > 0) {
          rollColor = 'green'; // Lucky roll
        } else if (rollDiff < 0) {
          rollColor = 'red'; // Unlucky roll
        }

        addFloatingLabel(
          slot.id,
          '', // Empty text - we only want to show the number
          rolledValue,
          rollColor
        );

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
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.spacing.xl,
        }}>
          {/* Player projection */}
          <div style={{ textAlign: 'center', minWidth: 120 }}>
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
            {/* Projected value text during resolution */}
            {(phase === 'resolving' || phase === 'result') && (
              <div style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary,
                marginTop: 4,
              }}>
                Projected: {playerProjection}
              </div>
            )}
            {/* Progress bar */}
            {(phase === 'resolving' || phase === 'result') && (
              <div style={{ marginTop: 4 }}>
                <ScoreProgressBar
                  current={animatingPlayerScore}
                  projection={playerProjection}
                  side="player"
                  isComplete={phase === 'result'}
                />
              </div>
            )}
          </div>

          {/* VS Divider */}
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.tertiary,
            fontWeight: 700,
            letterSpacing: '1px',
          }}>
            VS
          </div>

          {/* Enemy projection */}
          <div style={{ textAlign: 'center', minWidth: 120 }}>
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
            {/* Projected value text during resolution */}
            {(phase === 'resolving' || phase === 'result') && (
              <div style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary,
                marginTop: 4,
              }}>
                Projected: {enemyTotal}
              </div>
            )}
            {/* Progress bar */}
            {(phase === 'resolving' || phase === 'result') && (
              <div style={{ marginTop: 4 }}>
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

      {/* Battle Area with Hand - Combined container */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Two Column Battle Area - Scrollable */}
        <div style={{
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: theme.spacing.md,
          paddingBottom: 220, // Make room for the hand
          gap: theme.spacing.lg,
        }}>
          {/* Player Column */}
          <div style={{
            width: '100%',
            maxWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
          }}>
            {/* Column Header Badge
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
            </div> */}
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
            width: '100%',
            maxWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
          }}>
            {/* Column Header Badge
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
            </div> */}
            {enemySlots.map((slot, index) => (
              <EncounterSlotComponent
                key={slot.id}
                slot={slot}
                index={index}
                projection={{ baseValue: slot.critter?.level || 0, bonuses: [], totalValue: slot.critter?.level || 0 }}
                isHighlighted={phase === 'resolving' && resolutionStep === playerSlots.length + index + 1}
                floatingLabels={floatingLabels}
                onSlotClick={() => {}}
                phase={phase}
                timings={timings}
                side="enemy"
              />
            ))}
          </div>
        </div>

        {/* Card Hand - Fanned out overlapping cards, floating over battle area */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'transparent',
          padding: `${theme.spacing.md} 0`,
          pointerEvents: 'none',
          zIndex: 50,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: theme.spacing.sm,
            paddingTop: 100, // Extra space for card lift on hover/select
            paddingLeft: 0, // Space for first card overlap effect
            paddingRight: 0,
            minHeight: 300,
            overflowX: 'auto',
            overflowY: 'visible',
            pointerEvents: 'auto',
            WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          }}>
            {playerHand.map((critter, index) => {
              const isSelected = selectedCritterId === critter.id;
              const hasTrait = !!critter.trait;
              const totalCards = playerHand.length;

              // Calculate fan rotation: center cards at 0°, outer cards rotated
              const middleIndex = (totalCards - 1) / 2;
              const rotationAngle = (index - middleIndex) * 3; // 3° per card from center

              // Calculate arc: center cards higher, outer cards lower
              const distanceFromCenter = Math.abs(index - middleIndex);
              const arcOffset = distanceFromCenter * distanceFromCenter * 3; // Quadratic for smooth arc

              return (
                <motion.div
                  key={critter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: isSelected ? -10 : arcOffset,
                    scale: isSelected ? 1.1 : 1,
                    rotate: isSelected ? 0 : rotationAngle,
                    zIndex: isSelected ? 100 : totalCards - index,
                  }}
                  transition={{ delay: index * timings.cardEntranceDelay, duration: timings.cardEntranceDuration }}
                  onClick={() => handleHandClick(critter.id)}
                  whileHover={phase === 'rostering' ? {
                    scale: 1.15,
                    y: -10,
                    rotate: 0,
                    zIndex: 101,
                    transition: { duration: 0.15, ease: 'easeOut' },
                  } : {}}
                  whileTap={phase === 'rostering' ? { scale: 1.05 } : {}}
                  style={{
                    flexShrink: 0,
                    width: 150,
                    height: 210, // Fixed height for all cards
                    marginLeft: index === 0 ? 0 : -30, // Overlap cards
                    background: `linear-gradient(145deg, ${theme.colors.background.card} 0%, #efe5d8 100%)`,
                    borderRadius: theme.radius.lg,
                    padding: theme.spacing.md,
                    cursor: phase === 'rostering' ? 'pointer' : 'default',
                    textAlign: 'center',
                    boxShadow: isSelected
                      ? `0 12px 28px rgba(0,0,0,0.2), 0 0 0 3px ${theme.colors.brand.primary}`
                      : '0 6px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
                    position: 'relative',
                    border: `2px solid ${isSelected ? theme.colors.brand.primary : 'rgba(139, 115, 85, 0.2)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Trait indicator dot */}
                  {hasTrait && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#4caf50',
                      boxShadow: '0 0 6px rgba(76, 175, 80, 0.6)',
                    }} />
                  )}
                  {critter.image && (
                    <img
                      src={critter.image}
                      alt={critter.name}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: theme.radius.md,
                        objectFit: 'cover',
                        marginBottom: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    />
                  )}
                  <div style={{
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: 600,
                    color: theme.colors.text.primary,
                    lineHeight: 1.2,
                  }}>
                    {critter.name}
                  </div>
                  {/* Trait text - always same height */}
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.secondary,
                    lineHeight: 1.3,
                    height: 32, // Fixed height
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {hasTrait ? critter.trait!.text : '\u00A0'}
                  </div>
                  {/* Power badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 12px',
                    background: 'rgba(139, 115, 85, 0.15)',
                    borderRadius: theme.radius.sm,
                    fontSize: theme.typography.fontSize.base,
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
