import { getRandomCharacterImage } from '../utils/characterImages';

export interface Trait {
  text: string; // Display text like "+1 Bonus to each Adjacent Critter"
}

export interface VillageItem {
  id: string;
  name: string;
  type: 'critter' | 'building' | 'gear';
  level?: number; // For critters, this is now "powerlevel"
  description?: string;
  image?: string;
  isExhausted?: boolean; // Temporarily disabled status
  trait?: Trait; // Critters can have 0 or 1 trait
  bonus?: string; // Gear-specific bonus (e.g., "+1 Bonus", "Collect extra Acorns")
}

// Mock exhausted end times (timestamps when exhaustion expires)
// In a real app, these would come from your backend/game state
export const EXHAUSTED_END_TIMES: Record<string, number> = {
  'c2': Date.now() + 2 * 60 * 1000 + 45 * 1000,  // Mountain Bear - 2:45 from now
  'c4': Date.now() + 5 * 60 * 1000 + 12 * 1000,  // Sky Hawk - 5:12 from now
};

// Helper function to format remaining time
export function formatTimeRemaining(endTime: number): string {
  const now = Date.now();
  const remaining = Math.max(0, endTime - now);

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

// Mock Critters with powerlevels and traits
export const MOCK_CRITTERS: VillageItem[] = [
  {
    id: 'c1',
    name: 'Forest Fox',
    type: 'critter',
    level: 5,
    description: '+1 Bonus to each Adjacent Critter',
    image: getRandomCharacterImage(),
    trait: { text: '+1 Bonus to each Adjacent Critter' }
  },
  {
    id: 'c2',
    name: 'Mountain Bear',
    type: 'critter',
    level: 8,
    description: '+3 Bonus but always Exhausts after use',
    image: getRandomCharacterImage(),
    isExhausted: true,
    trait: { text: '+3 Bonus but always Exhausts after use' }
  },
  {
    id: 'c3',
    name: 'River Otter',
    type: 'critter',
    level: 3,
    image: getRandomCharacterImage()
    // No trait, no description
  },
  {
    id: 'c4',
    name: 'Sky Hawk',
    type: 'critter',
    level: 6,
    description: 'Double when facing a single enemy',
    image: getRandomCharacterImage(),
    isExhausted: true,
    trait: { text: 'Double when facing a single enemy' }
  },
  {
    id: 'c5',
    name: 'Garden Rabbit',
    type: 'critter',
    level: 2,
    description: '+2 Bonus when Last',
    image: getRandomCharacterImage(),
    trait: { text: '+2 Bonus when Last' }
  },
  {
    id: 'c6',
    name: 'Cave Badger',
    type: 'critter',
    level: 7,
    description: '+2 Bonus when Outnumbered',
    image: getRandomCharacterImage(),
    trait: { text: '+2 Bonus when Outnumbered' }
  },
  {
    id: 'c7',
    name: 'Meadow Mouse',
    type: 'critter',
    level: 1,
    description: 'Adjacent Critters roll Lucky',
    image: getRandomCharacterImage(),
    trait: { text: 'Adjacent Critters roll Lucky' }
  },
];

// Mock Buildings
export const MOCK_BUILDINGS: VillageItem[] = [
  { id: 'b1', name: 'Town Hall', type: 'building', level: 10, description: 'Heart of the village' },
  { id: 'b2', name: 'Blacksmith', type: 'building', level: 7, description: 'Forge powerful gear' },
  { id: 'b3', name: 'Market', type: 'building', level: 5, description: 'Trade goods here' },
  { id: 'b4', name: 'Library', type: 'building', level: 4, description: 'Study and learn' },
];

// Mock Gear - Specific named items with unique bonuses
export const MOCK_GEAR: VillageItem[] = [
  { id: 'g1', name: 'Pointy Stick', type: 'gear', bonus: '+1 Bonus', description: 'Simple but effective' },
  { id: 'g2', name: 'Heavy Style', type: 'gear', bonus: 'First Slot Doubles and Exhausts', description: 'All-in strategy' },
  { id: 'g3', name: 'Nut Collector', type: 'gear', bonus: 'Collect extra Acorns', description: 'Gather more resources' },
  { id: 'g4', name: 'Lucky Charm', type: 'gear', bonus: 'Reroll once per battle', description: 'Fortune favors the bold' },
  { id: 'g5', name: 'Sturdy Shield', type: 'gear', bonus: '+2 Bonus when defending', description: 'Hold the line' },
  { id: 'g6', name: 'Swift Boots', type: 'gear', bonus: 'Go first in combat', description: 'Speed is key' },
  { id: 'g7', name: 'Team Banner', type: 'gear', bonus: '+1 to all Critters', description: 'Rally the troops' },
  { id: 'g8', name: 'Last Stand', type: 'gear', bonus: '+4 when alone', description: 'Fight with desperation' },
  { id: 'g9', name: 'Acorn Hoard', type: 'gear', bonus: 'Double Acorns this battle', description: 'Strike it rich' },
  { id: 'g10', name: 'Battle Horn', type: 'gear', bonus: 'Unexhaust one Critter', description: 'Call back to the fight' },
];

// Collection limits
export const MAX_CRITTERS = 10;
export const MAX_BUILDINGS = 8;
export const MAX_GEAR = 12;
