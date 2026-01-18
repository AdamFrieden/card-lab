import { getRandomCharacterImage } from '../utils/characterImages';
import type { VillageItem } from './mockVillageData';
import type { EncounterConfig } from '../types/encounter';

// Enemy critters for encounters
export const ENEMY_CRITTERS: VillageItem[] = [
  {
    id: 'e1',
    name: 'Goblin Scout',
    type: 'critter',
    level: 3,
    image: getRandomCharacterImage(),
  },
  {
    id: 'e2',
    name: 'Orc Grunt',
    type: 'critter',
    level: 5,
    image: getRandomCharacterImage(),
  },
  {
    id: 'e3',
    name: 'Troll Brute',
    type: 'critter',
    level: 7,
    image: getRandomCharacterImage(),
  },
  {
    id: 'e4',
    name: 'Dark Sprite',
    type: 'critter',
    level: 4,
    image: getRandomCharacterImage(),
  },
  {
    id: 'e5',
    name: 'Shadow Wolf',
    type: 'critter',
    level: 6,
    image: getRandomCharacterImage(),
  },
  {
    id: 'e6',
    name: 'Skeleton Warrior',
    type: 'critter',
    level: 4,
    image: getRandomCharacterImage(),
  },
  {
    id: 'e7',
    name: 'Swamp Lurker',
    type: 'critter',
    level: 8,
    image: getRandomCharacterImage(),
  },
];

// Predefined enemy lineups by difficulty
export const ENEMY_LINEUPS = {
  easy: [ENEMY_CRITTERS[0], ENEMY_CRITTERS[3]], // Goblin + Sprite = 7 power
  medium: [ENEMY_CRITTERS[0], ENEMY_CRITTERS[1], ENEMY_CRITTERS[3]], // 12 power
  hard: [ENEMY_CRITTERS[1], ENEMY_CRITTERS[2], ENEMY_CRITTERS[4]], // 18 power
  brutal: [ENEMY_CRITTERS[2], ENEMY_CRITTERS[4], ENEMY_CRITTERS[6], ENEMY_CRITTERS[1]], // 26 power
};

export type DifficultyLevel = keyof typeof ENEMY_LINEUPS;

// Helper to create a default encounter config
export function createEncounterConfig(
  playerSlotCount: number = 3,
  difficulty: DifficultyLevel = 'medium'
): EncounterConfig {
  return {
    playerSlotCount,
    enemyCritters: [...ENEMY_LINEUPS[difficulty]],
  };
}

// Calculate total power for a lineup
export function calculateLineupPower(critters: VillageItem[]): number {
  return critters.reduce((sum, c) => sum + (c.level || 0), 0);
}
