import type { VillageItem } from '../data/mockVillageData';
import type { EncounterSlot, TraitBonus, SlotProjection } from '../types/encounter';

/**
 * Parse trait text to determine bonus type and amount.
 * This is a simplified implementation - extend as needed for more trait types.
 */
function parseTraitBonus(
  critter: VillageItem,
  slot: EncounterSlot,
  allPlayerSlots: EncounterSlot[],
  allEnemySlots: EncounterSlot[]
): TraitBonus | null {
  if (!critter.trait) return null;

  const traitText = critter.trait.text.toLowerCase();
  const filledPlayerSlots = allPlayerSlots.filter(s => s.critter !== null);
  const filledEnemySlots = allEnemySlots.filter(s => s.critter !== null);

  // "+1 Bonus to each Adjacent Critter" - gives bonus TO adjacent critters, not self
  // This is handled in getAdjacentBonuses instead
  if (traitText.includes('adjacent critter')) {
    return null; // Handled separately
  }

  // "+3 Bonus but always Exhausts after use"
  if (traitText.includes('+3 bonus') && traitText.includes('exhaust')) {
    return {
      source: critter.name,
      amount: 3,
      description: `+3 from ${critter.name} (Exhausting)`,
    };
  }

  // "Double when facing a single enemy"
  if (traitText.includes('double') && traitText.includes('single enemy')) {
    if (filledEnemySlots.length === 1) {
      return {
        source: critter.name,
        amount: critter.level || 0, // Double means add base again
        description: `x2 from ${critter.name} (Single Enemy)`,
      };
    }
    return null;
  }

  // "+2 Bonus when Last"
  if (traitText.includes('+2') && traitText.includes('last')) {
    const isLast = slot.position === Math.max(...filledPlayerSlots.map(s => s.position));
    if (isLast && filledPlayerSlots.length > 0) {
      return {
        source: critter.name,
        amount: 2,
        description: `+2 from ${critter.name} (Last Position)`,
      };
    }
    return null;
  }

  // "+2 Bonus when Outnumbered"
  if (traitText.includes('+2') && traitText.includes('outnumbered')) {
    if (filledPlayerSlots.length < filledEnemySlots.length) {
      return {
        source: critter.name,
        amount: 2,
        description: `+2 from ${critter.name} (Outnumbered)`,
      };
    }
    return null;
  }

  return null;
}

/**
 * Get bonuses from adjacent critters (Forest Fox style trait)
 */
function getAdjacentBonuses(
  slot: EncounterSlot,
  allPlayerSlots: EncounterSlot[]
): TraitBonus[] {
  const bonuses: TraitBonus[] = [];

  // Find adjacent slots (position +/- 1)
  const adjacentSlots = allPlayerSlots.filter(
    s => s.critter !== null && Math.abs(s.position - slot.position) === 1
  );

  for (const adjSlot of adjacentSlots) {
    const adjCritter = adjSlot.critter!;
    if (adjCritter.trait?.text.toLowerCase().includes('adjacent critter')) {
      // Extract bonus amount from trait text (assumes "+N Bonus" format)
      const match = adjCritter.trait.text.match(/\+(\d+)/);
      const amount = match ? parseInt(match[1], 10) : 1;
      bonuses.push({
        source: adjCritter.name,
        amount,
        description: `+${amount} from ${adjCritter.name} (Adjacent)`,
      });
    }
  }

  return bonuses;
}

/**
 * Calculate projection for a single slot
 */
export function calculateSlotProjection(
  slot: EncounterSlot,
  allPlayerSlots: EncounterSlot[],
  allEnemySlots: EncounterSlot[]
): SlotProjection {
  if (!slot.critter) {
    return { baseValue: 0, bonuses: [], totalValue: 0 };
  }

  const baseValue = slot.critter.level || 0;
  const bonuses: TraitBonus[] = [];

  // Get self-trait bonus
  const selfBonus = parseTraitBonus(slot.critter, slot, allPlayerSlots, allEnemySlots);
  if (selfBonus) {
    bonuses.push(selfBonus);
  }

  // Get adjacent bonuses (from other critters)
  if (slot.side === 'player') {
    const adjBonuses = getAdjacentBonuses(slot, allPlayerSlots);
    bonuses.push(...adjBonuses);
  }

  const totalBonus = bonuses.reduce((sum, b) => sum + b.amount, 0);

  return {
    baseValue,
    bonuses,
    totalValue: baseValue + totalBonus,
  };
}

/**
 * Calculate total projection for all slots on a side
 */
export function calculateTeamProjection(
  slots: EncounterSlot[],
  allPlayerSlots: EncounterSlot[],
  allEnemySlots: EncounterSlot[]
): number {
  return slots.reduce((total, slot) => {
    const projection = calculateSlotProjection(slot, allPlayerSlots, allEnemySlots);
    return total + projection.totalValue;
  }, 0);
}

/**
 * Calculate enemy team total (simple sum, enemies don't have traits for now)
 */
export function calculateEnemyTotal(enemySlots: EncounterSlot[]): number {
  return enemySlots.reduce((total, slot) => {
    return total + (slot.critter?.level || 0);
  }, 0);
}

/**
 * Get all trait bonuses that would activate for display purposes
 */
export function getAllTraitBonuses(
  playerSlots: EncounterSlot[],
  enemySlots: EncounterSlot[]
): { slot: EncounterSlot; bonuses: TraitBonus[] }[] {
  return playerSlots
    .filter(slot => slot.critter !== null)
    .map(slot => ({
      slot,
      bonuses: calculateSlotProjection(slot, playerSlots, enemySlots).bonuses,
    }))
    .filter(result => result.bonuses.length > 0);
}
