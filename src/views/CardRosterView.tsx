import { useState, useMemo, useCallback } from 'react';
import { CardHand } from '../components/CardHand';
import { SlotList } from '../components/SlotList';
import { PowerCounter } from '../components/PowerCounter';
import { getRandomCharacterImage } from '../utils/characterImages';
import type { Card, Slot, AnimationConfig } from '../types';

// Helper function to generate random power value
const randomPower = () => Math.floor(Math.random() * 10) + 1;

// Mock data
const INITIAL_CARDS: Card[] = [
  { id: '1', name: 'Card 1', description: 'First card', powerValue: randomPower(), characterImage: getRandomCharacterImage() },
  { id: '2', name: 'Card 2', description: 'Second card', powerValue: randomPower(), characterImage: getRandomCharacterImage() },
  { id: '3', name: 'Card 3', description: 'Third card', powerValue: randomPower(), characterImage: getRandomCharacterImage() },
  { id: '4', name: 'Card 4', description: 'Fourth card', powerValue: randomPower(), characterImage: getRandomCharacterImage() },
  { id: '5', name: 'Card 5', description: 'Fifth card', powerValue: randomPower(), characterImage: getRandomCharacterImage() },
  { id: '6', name: 'Card 6', description: 'Sixth card', powerValue: randomPower(), characterImage: getRandomCharacterImage() },
];

const INITIAL_SLOTS: Slot[] = [
  { id: 's1', card: null },
  { id: 's2', card: null },
  { id: 's3', card: null },
  { id: 's4', card: null },
  { id: 's5', card: null },
];

interface CardRosterViewProps {
  animationConfig: AnimationConfig;
}

export function CardRosterView({ animationConfig }: CardRosterViewProps) {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [previewSlotId, setPreviewSlotId] = useState<string | null>(null);
  const [unrosteringCardId, setUnrosteringCardId] = useState<string | null>(null);
  const [handScrollPosition, setHandScrollPosition] = useState<number>(0);
  const [shouldScrollToSlot, setShouldScrollToSlot] = useState<boolean>(false);

  // Calculate total power from rostered cards
  const totalPower = useMemo(() => {
    return slots.reduce((sum, slot) => {
      return sum + (slot.card?.powerValue || 0);
    }, 0);
  }, [slots]);

  const handleSelectCard = useCallback((cardId: string) => {
    if (selectedCardId === cardId) {
      // Deselect card (keep slot selection if present)
      setSelectedCardId(null);
      setShouldScrollToSlot(false);
    } else {
      // Select card and use current preview slot or find first empty slot
      setSelectedCardId(cardId);
      if (!previewSlotId) {
        const firstEmptySlot = slots.find(slot => slot.card === null);
        if (firstEmptySlot) {
          setPreviewSlotId(firstEmptySlot.id);
          setShouldScrollToSlot(true); // Enable scroll when auto-selecting slot
        }
      }
    }
  }, [selectedCardId, slots, previewSlotId]);

  const handleSelectSlot = useCallback((slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || slot.card !== null) return;

    // Toggle preview: if clicking the same slot, deselect it; otherwise, select it
    if (previewSlotId === slotId) {
      setPreviewSlotId(null);
      // Also deselect the card when deselecting the slot
      setSelectedCardId(null);
      setShouldScrollToSlot(false);
    } else {
      setPreviewSlotId(slotId);
      setShouldScrollToSlot(false); // Don't scroll when manually clicking a slot
    }
  }, [slots, previewSlotId]);

  const handleRosterCard = useCallback(() => {
    if (!selectedCardId || !previewSlotId) return;

    const selectedCard = cards.find(c => c.id === selectedCardId);
    if (!selectedCard) return;

    // FLIP happens automatically: state change triggers layout animation
    // React 18+ automatically batches these updates into a single render
    // Card will only exist in one location per render pass
    setCards(prev => prev.filter(c => c.id !== selectedCardId));
    setSlots(prev =>
      prev.map(slot =>
        slot.id === previewSlotId
          ? { ...slot, card: selectedCard }
          : slot
      )
    );

    // Clear selection
    setSelectedCardId(null);
    setPreviewSlotId(null);
    setShouldScrollToSlot(false);
  }, [selectedCardId, previewSlotId, cards]);

  const handleUnrosterCard = useCallback((slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.card) return;

    const cardToUnroster = slot.card;

    // Mark card as unrostering to trigger fade-out animation
    setUnrosteringCardId(cardToUnroster.id);

    // Remove from slot and add to hand after a brief delay for fade-out
    setTimeout(() => {
      setSlots(prev =>
        prev.map(s =>
          s.id === slotId
            ? { ...s, card: null }
            : s
        )
      );

      // Insert card near the current scroll position for better mobile UX
      setCards(prev => {
        // Insert near visible position, but clamp to valid range
        const insertIndex = Math.min(handScrollPosition, prev.length);
        return [
          ...prev.slice(0, insertIndex),
          cardToUnroster,
          ...prev.slice(insertIndex)
        ];
      });

      // Clear unrostering state
      setUnrosteringCardId(null);
    }, 200); // Match fade-out duration
  }, [slots, handScrollPosition]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px 20px',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexShrink: 0
      }}>
        <PowerCounter value={totalPower} />
      </div>

      <SlotList
        slots={slots}
        previewSlotId={previewSlotId}
        onUnrosterCard={handleUnrosterCard}
        unrosteringCardId={unrosteringCardId}
        onSelectSlot={handleSelectSlot}
        shouldScrollToPreview={shouldScrollToSlot}
        animationConfig={animationConfig}
      />

      {selectedCardId && (
        <button
          className="roster-button"
          onClick={handleRosterCard}
        >
          Roster Card
        </button>
      )}

      <CardHand
        cards={cards}
        selectedCardId={selectedCardId}
        onSelectCard={handleSelectCard}
        animationConfig={animationConfig}
        onScrollPositionChange={setHandScrollPosition}
      />
    </div>
  );
}
