import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { AnimationConfig } from '../types';
import { VerticalPicker } from '../components/VerticalPicker';
import { PickerItem } from '../components/PickerItem';
import { useTheme } from '../theme';
import {
  MOCK_CRITTERS,
  MOCK_BUILDINGS,
  MOCK_GEAR,
  EXHAUSTED_END_TIMES,
  formatTimeRemaining,
  MAX_CRITTERS,
  MAX_BUILDINGS,
  MAX_GEAR,
  type VillageItem,
} from '../data/mockVillageData';

interface VillageViewProps {
  animationConfig: AnimationConfig;
}

export function VillageView({ animationConfig }: VillageViewProps) {
  const theme = useTheme();
  const [critters] = useState<VillageItem[]>(MOCK_CRITTERS);
  const [buildings] = useState<VillageItem[]>(MOCK_BUILDINGS);
  const [gear] = useState<VillageItem[]>(MOCK_GEAR);

  // Picker state
  const [showCritterPicker, setShowCritterPicker] = useState(false);
  const [showBuildingPicker, setShowBuildingPicker] = useState(false);
  const [showGearPicker, setShowGearPicker] = useState(false);

  // Countdown timer state - updates every second
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // Update current time every second for countdown timers
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      gap: '20px',
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
          🏘️ Your Village
        </h2>
        <p style={{
          color: theme.colors.text.secondary,
          margin: 0,
          fontSize: '14px',
        }}>
          Manage your critters, buildings, and gear
        </p>
      </div>

      {/* Critters Section - Opens a modal picker */}
      <motion.button
        onClick={() => setShowCritterPicker(true)}
        whileHover={{
          scale: 1.02,
          y: -2,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        style={{
          width: '100%',
          maxWidth: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.lg,
          background: theme.colors.background.card,
          border: `2px solid ${theme.colors.border.default}`,
          borderRadius: theme.radius.sm,
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: theme.shadows.card,
        }}
      >
        {/* Left: Icon and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
        }}>
          <span style={{ fontSize: '32px' }}>🦊</span>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{
              margin: 0,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.primary,
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}>
              Critters
            </h3>
            <p style={{
              margin: 0,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              fontWeight: 600,
            }}>
              {critters.length} / {MAX_CRITTERS}
            </p>
          </div>
        </div>

        {/* Right: View Icon */}
        <div
          style={{
            fontSize: '20px',
            color: theme.colors.text.tertiary,
            fontWeight: 'bold',
          }}
        >
        </div>
      </motion.button>

      {/* Buildings Section - Opens a modal picker */}
      <motion.button
        onClick={() => setShowBuildingPicker(true)}
        whileHover={{
          scale: 1.02,
          y: -2,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        style={{
          width: '100%',
          maxWidth: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.lg,
          background: theme.colors.background.card,
          border: `2px solid ${theme.colors.border.default}`,
          borderRadius: theme.radius.sm,
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: theme.shadows.card,
        }}
      >
        {/* Left: Icon and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
        }}>
          <span style={{ fontSize: '32px' }}>🏠</span>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{
              margin: 0,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.primary,
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}>
              Buildings
            </h3>
            <p style={{
              margin: 0,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              fontWeight: 600,
            }}>
              {buildings.length} / {MAX_BUILDINGS}
            </p>
          </div>
        </div>

        {/* Right: View Icon */}
        <div
          style={{
            fontSize: '20px',
            color: theme.colors.text.tertiary,
            fontWeight: 'bold',
          }}
        >
        </div>
      </motion.button>

      {/* Gear Section - Opens a modal picker */}
      <motion.button
        onClick={() => setShowGearPicker(true)}
        whileHover={{
          scale: 1.02,
          y: -2,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        style={{
          width: '100%',
          maxWidth: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.lg,
          background: theme.colors.background.card,
          border: `2px solid ${theme.colors.border.default}`,
          borderRadius: theme.radius.sm,
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: theme.shadows.card,
        }}
      >
        {/* Left: Icon and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
        }}>
          <span style={{ fontSize: '32px' }}>⚔️</span>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{
              margin: 0,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.primary,
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}>
              Gear
            </h3>
            <p style={{
              margin: 0,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              fontWeight: 600,
            }}>
              {gear.length} / {MAX_GEAR}
            </p>
          </div>
        </div>

        {/* Right: View Icon */}
        <div
          style={{
            fontSize: '20px',
            color: theme.colors.text.tertiary,
            fontWeight: 'bold',
          }}
        >
        </div>
      </motion.button>

      {/* Bottom spacing for mobile */}
      <div style={{ height: '20px', flexShrink: 0 }} />

      {/* Critter Picker Modal */}
      <VerticalPicker
        isOpen={showCritterPicker}
        onClose={() => setShowCritterPicker(false)}
        title="Your Critters"
        emoji="🦊"
        maxCount={MAX_CRITTERS}
        currentCount={critters.length}
      >
        {critters.map(critter => {
          // Calculate countdown timer if exhausted
          const endTime = EXHAUSTED_END_TIMES[critter.id];
          const exhaustedTimer = critter.isExhausted && endTime
            ? formatTimeRemaining(endTime)
            : undefined;

          return (
            <PickerItem
              key={critter.id}
              id={critter.id}
              name={critter.name}
              image={critter.image}
              level={critter.level}
              trait={critter.trait?.text}
              icon="🦊"
              layout="horizontal"
              isExhausted={critter.isExhausted}
              exhaustedTimer={exhaustedTimer}
              onClick={(id) => {
                console.log('Selected critter:', id);
              }}
            />
          );
        })}
      </VerticalPicker>

      {/* Building Picker Modal */}
      <VerticalPicker
        isOpen={showBuildingPicker}
        onClose={() => setShowBuildingPicker(false)}
        title="Your Buildings"
        emoji="🏠"
        maxCount={MAX_BUILDINGS}
        currentCount={buildings.length}
      >
        {buildings.map(building => (
          <PickerItem
            key={building.id}
            id={building.id}
            name={building.name}
            level={building.level}
            description={building.description}
            icon="🏠"
            layout="horizontal"
            onClick={(id) => {
              console.log('Selected building:', id);
            }}
          />
        ))}
      </VerticalPicker>

      {/* Gear Picker Modal */}
      <VerticalPicker
        isOpen={showGearPicker}
        onClose={() => setShowGearPicker(false)}
        title="Your Gear"
        emoji="⚔️"
        maxCount={MAX_GEAR}
        currentCount={gear.length}
      >
        {gear.map(item => (
          <PickerItem
            key={item.id}
            id={item.id}
            name={item.name}
            bonus={item.bonus}
            description={item.description}
            icon="⚔️"
            layout="horizontal"
            onClick={(id) => {
              console.log('Selected gear:', id);
            }}
          />
        ))}
      </VerticalPicker>
    </div>
  );
}
