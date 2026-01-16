import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AnimationConfig } from '../types';
import { ExpandableList } from '../components/ExpandableList';
import { VillageCard } from '../components/VillageCard';
import { getRandomCharacterImage } from '../utils/characterImages';
import { useTheme } from '../theme';

interface VillageViewProps {
  animationConfig: AnimationConfig;
}

// Mock data types
interface VillageItem {
  id: string;
  name: string;
  type: 'critter' | 'building' | 'gear';
  level?: number;
  description?: string;
  image?: string;
}

// Generate mock data
const MOCK_CRITTERS: VillageItem[] = [
  { id: 'c1', name: 'Forest Fox', type: 'critter', level: 5, description: 'Swift and clever', image: getRandomCharacterImage() },
  { id: 'c2', name: 'Mountain Bear', type: 'critter', level: 8, description: 'Strong and brave', image: getRandomCharacterImage() },
  { id: 'c3', name: 'River Otter', type: 'critter', level: 3, description: 'Playful swimmer', image: getRandomCharacterImage() },
  { id: 'c4', name: 'Sky Hawk', type: 'critter', level: 6, description: 'Sharp-eyed scout', image: getRandomCharacterImage() },
  { id: 'c5', name: 'Garden Rabbit', type: 'critter', level: 2, description: 'Quick gatherer', image: getRandomCharacterImage() },
];

const MOCK_BUILDINGS: VillageItem[] = [
  { id: 'b1', name: 'Town Hall', type: 'building', level: 10, description: 'Heart of the village' },
  { id: 'b2', name: 'Blacksmith', type: 'building', level: 7, description: 'Forge powerful gear' },
  { id: 'b3', name: 'Market', type: 'building', level: 5, description: 'Trade goods here' },
  { id: 'b4', name: 'Library', type: 'building', level: 4, description: 'Study and learn' },
];

const MOCK_GEAR: VillageItem[] = [
  { id: 'g1', name: 'Iron Sword', type: 'gear', level: 5, description: '+10 Attack' },
  { id: 'g2', name: 'Wooden Shield', type: 'gear', level: 3, description: '+8 Defense' },
  { id: 'g3', name: 'Leather Boots', type: 'gear', level: 4, description: '+5 Speed' },
  { id: 'g4', name: 'Magic Ring', type: 'gear', level: 7, description: '+12 Magic' },
  { id: 'g5', name: 'Steel Helmet', type: 'gear', level: 6, description: '+9 Defense' },
  { id: 'g6', name: 'Crystal Amulet', type: 'gear', level: 8, description: '+15 Magic' },
];

export function VillageView({ animationConfig }: VillageViewProps) {
  const theme = useTheme();
  const [critters] = useState<VillageItem[]>(MOCK_CRITTERS);
  const [buildings] = useState<VillageItem[]>(MOCK_BUILDINGS);
  const [gear] = useState<VillageItem[]>(MOCK_GEAR);

  // Currency and packs state
  const [acorns, setAcorns] = useState(250);
  const [critterPacks, setCritterPacks] = useState(2);
  const [gearPacks, setGearPacks] = useState(1);
  const [villagePacks, setVillagePacks] = useState(0);

  const MAX_CRITTERS = 10;
  const MAX_BUILDINGS = 8;
  const MAX_GEAR = 12;

  // Pack prices
  const PACK_PRICES = {
    critter: 50,
    gear: 75,
    village: 100,
  };

  // Purchase pack handler
  const handleBuyPack = (packType: 'critter' | 'gear' | 'village') => {
    const price = PACK_PRICES[packType];
    if (acorns >= price) {
      setAcorns(prev => prev - price);
      if (packType === 'critter') setCritterPacks(prev => prev + 1);
      else if (packType === 'gear') setGearPacks(prev => prev + 1);
      else if (packType === 'village') setVillagePacks(prev => prev + 1);
    }
  };

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

      {/* Currency and Packs Display */}
      <div style={{
        width: '100%',
        maxWidth: 500,
        display: 'flex',
        gap: theme.spacing.md,
        flexShrink: 0,
      }}>
        {/* Acorns */}
        <div
          style={{
            flex: 1,
            padding: theme.spacing.md,
            background: theme.colors.background.card,
            border: `2px solid ${theme.colors.border.default}`,
            borderRadius: theme.radius.sm,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            justifyContent: 'center',
            boxShadow: theme.shadows.glow,
            transform: 'translateY(-2px) rotate(-0.5deg)',
          }}
        >
          <span style={{ fontSize: '24px' }}>🌰</span>
          <div>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Acorns
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
            }}>
              {acorns}
            </div>
          </div>
        </div>

        {/* Unopened Packs */}
        <div
          style={{
            flex: 1,
            padding: theme.spacing.md,
            background: theme.colors.background.card,
            border: `2px solid ${theme.colors.border.default}`,
            borderRadius: theme.radius.sm,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            justifyContent: 'center',
            boxShadow: theme.shadows.glow,
            transform: 'rotate(0.5deg)',
          }}
        >
          <span style={{ fontSize: '24px' }}>📦</span>
          <div>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Packs
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
            }}>
              {critterPacks + gearPacks + villagePacks}
            </div>
          </div>
        </div>
      </div>

      {/* Pack Shop - Now as ExpandableList */}
      <ExpandableList
        title="Pack Shop"
        emoji="🛒"
        count={critterPacks + gearPacks + villagePacks}
        maxCount={99}
        index={0}
      >
          {/* Critter Pack */}
          <motion.button
            whileHover={{
              scale: 1.03,
              rotateX: -3,
              boxShadow: theme.shadows.cardHover,
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleBuyPack('critter')}
            disabled={acorns < PACK_PRICES.critter}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: theme.spacing.md,
              background: acorns >= PACK_PRICES.critter ? theme.colors.background.panel : theme.colors.background.app,
              border: acorns >= PACK_PRICES.critter ? `2px solid ${theme.colors.border.strong}` : `2px solid ${theme.colors.border.default}`,
              borderRadius: theme.radius.sm,
              cursor: acorns >= PACK_PRICES.critter ? 'pointer' : 'not-allowed',
              opacity: acorns >= PACK_PRICES.critter ? 1 : 0.6,
              boxShadow: theme.shadows.card,
              perspective: '1000px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
              <span style={{ fontSize: '28px' }}>🦊</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: 700,
                  color: theme.colors.text.primary,
                }}>
                  Critter Pack
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  fontWeight: 600,
                }}>
                  Owned: {critterPacks}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.tertiary,
            }}>
              <span>🌰</span> {PACK_PRICES.critter}
            </div>
          </motion.button>

          {/* Gear Pack */}
          <motion.button
            whileHover={{
              scale: 1.03,
              rotateX: -3,
              boxShadow: theme.shadows.cardHover,
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleBuyPack('gear')}
            disabled={acorns < PACK_PRICES.gear}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: theme.spacing.md,
              background: acorns >= PACK_PRICES.gear ? theme.colors.background.panel : theme.colors.background.app,
              border: acorns >= PACK_PRICES.gear ? `2px solid ${theme.colors.border.strong}` : `2px solid ${theme.colors.border.default}`,
              borderRadius: theme.radius.sm,
              cursor: acorns >= PACK_PRICES.gear ? 'pointer' : 'not-allowed',
              opacity: acorns >= PACK_PRICES.gear ? 1 : 0.6,
              boxShadow: theme.shadows.card,
              perspective: '1000px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
              <span style={{ fontSize: '28px' }}>⚔️</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: 700,
                  color: theme.colors.text.primary,
                }}>
                  Gear Pack
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  fontWeight: 600,
                }}>
                  Owned: {gearPacks}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.tertiary,
            }}>
              <span>🌰</span> {PACK_PRICES.gear}
            </div>
          </motion.button>

          {/* Village Pack */}
          <motion.button
            whileHover={{
              scale: 1.03,
              rotateX: -3,
              boxShadow: theme.shadows.cardHover,
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleBuyPack('village')}
            disabled={acorns < PACK_PRICES.village}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: theme.spacing.md,
              background: acorns >= PACK_PRICES.village ? theme.colors.background.panel : theme.colors.background.app,
              border: acorns >= PACK_PRICES.village ? `2px solid ${theme.colors.border.strong}` : `2px solid ${theme.colors.border.default}`,
              borderRadius: theme.radius.sm,
              cursor: acorns >= PACK_PRICES.village ? 'pointer' : 'not-allowed',
              opacity: acorns >= PACK_PRICES.village ? 1 : 0.6,
              boxShadow: theme.shadows.card,
              perspective: '1000px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
              <span style={{ fontSize: '28px' }}>🏠</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: 700,
                  color: theme.colors.text.primary,
                }}>
                  Village Pack
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  fontWeight: 600,
                }}>
                  Owned: {villagePacks}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.tertiary,
            }}>
              <span>🌰</span> {PACK_PRICES.village}
            </div>
          </motion.button>
      </ExpandableList>

      {/* Critters Section */}
      <ExpandableList
        title="Critters"
        emoji="🦊"
        count={critters.length}
        maxCount={MAX_CRITTERS}
        index={1}
      >
        {critters.map(critter => (
          <VillageCard key={critter.id} {...critter} />
        ))}
      </ExpandableList>

      {/* Buildings Section */}
      <ExpandableList
        title="Buildings"
        emoji="🏠"
        count={buildings.length}
        maxCount={MAX_BUILDINGS}
        index={2}
      >
        {buildings.map(building => (
          <VillageCard key={building.id} {...building} />
        ))}
      </ExpandableList>

      {/* Gear Section */}
      <ExpandableList
        title="Gear"
        emoji="⚔️"
        count={gear.length}
        maxCount={MAX_GEAR}
        index={3}
      >
        {gear.map(item => (
          <VillageCard key={item.id} {...item} />
        ))}
      </ExpandableList>

      {/* Bottom spacing for mobile */}
      <div style={{ height: '20px', flexShrink: 0 }} />
    </div>
  );
}
