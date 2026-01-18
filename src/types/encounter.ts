import type { VillageItem } from '../data/mockVillageData';

export interface EncounterSlot {
  id: string;
  critter: VillageItem | null;
  position: number;
  side: 'player' | 'enemy';
}

export interface EncounterConfig {
  playerSlotCount: number;
  enemyCritters: VillageItem[];
}

export type EncounterPhase = 'rostering' | 'resolving' | 'result';

export interface TraitBonus {
  source: string; // critter name that provides the bonus
  amount: number;
  description: string; // e.g., "+1 from Forest Fox (Adjacent)"
}

export interface SlotProjection {
  baseValue: number;
  bonuses: TraitBonus[];
  totalValue: number;
}

export interface EncounterState {
  phase: EncounterPhase;
  playerSlots: EncounterSlot[];
  enemySlots: EncounterSlot[];
  playerHand: VillageItem[]; // critters available to roster
  selectedCritterId: string | null; // critter selected from hand
}

export interface EncounterResult {
  playerScore: number;
  enemyScore: number;
  victory: boolean;
}
