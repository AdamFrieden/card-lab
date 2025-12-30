import { useState, useMemo } from 'react';
import { CardHand } from './components/CardHand';
import { SlotList } from './components/SlotList';
import { ConfigPanel } from './components/ConfigPanel';
import { PowerCounter } from './components/PowerCounter';
import type { Card, Slot, AnimationConfig } from './types';
import { DEFAULT_ANIMATION_CONFIG } from './types';
import './App.css';

// Helper function to generate random power value
const randomPower = () => Math.floor(Math.random() * 10) + 1;

// Mock data
const INITIAL_CARDS: Card[] = [
  { id: '1', name: 'Card 1', description: 'First card', powerValue: randomPower() },
  { id: '2', name: 'Card 2', description: 'Second card', powerValue: randomPower() },
  { id: '3', name: 'Card 3', description: 'Third card', powerValue: randomPower() },
  { id: '4', name: 'Card 4', description: 'Fourth card', powerValue: randomPower() },
  { id: '5', name: 'Card 5', description: 'Fifth card', powerValue: randomPower() },
  { id: '6', name: 'Card 6', description: 'Sixth card', powerValue: randomPower() },
];

const INITIAL_SLOTS: Slot[] = [
  { id: 's1', card: null },
  { id: 's2', card: null },
  { id: 's3', card: null },
  { id: 's4', card: null },
  { id: 's5', card: null },
];

function App() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [previewSlotId, setPreviewSlotId] = useState<string | null>(null);
  const [rosteringCardId, setRosteringCardId] = useState<string | null>(null);
  const [unrosteringCardId, setUnrosteringCardId] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(DEFAULT_ANIMATION_CONFIG);

  // Calculate total power from rostered cards
  const totalPower = useMemo(() => {
    return slots.reduce((sum, slot) => {
      return sum + (slot.card?.powerValue || 0);
    }, 0);
  }, [slots]);

  const handleSelectCard = (cardId: string) => {
    if (selectedCardId === cardId) {
      // Deselect
      setSelectedCardId(null);
      setPreviewSlotId(null);
    } else {
      // Select and preview in first empty slot
      setSelectedCardId(cardId);
      const firstEmptySlot = slots.find(slot => slot.card === null);
      if (firstEmptySlot) {
        setPreviewSlotId(firstEmptySlot.id);
      }
    }
  };

  const handleRosterCard = () => {
    if (!selectedCardId || !previewSlotId) return;

    const selectedCard = cards.find(c => c.id === selectedCardId);
    if (!selectedCard) return;

    // Mark card as rostering (for animation state)
    setRosteringCardId(selectedCardId);

    // Add card to slot immediately (this triggers the layout animation)
    setSlots(prev =>
      prev.map(slot =>
        slot.id === previewSlotId
          ? { ...slot, card: selectedCard }
          : slot
      )
    );

    // Calculate animation duration based on spring config
    const animationDuration = Math.max(
      500,
      (1000 * animationConfig.springDamping) / animationConfig.springStiffness * 10
    );

    // Delay removing card from hand to allow layout animation to complete
    setTimeout(() => {
      setCards(prev => prev.filter(c => c.id !== selectedCardId));
      setRosteringCardId(null);
    }, animationDuration);

    // Clear selection
    setSelectedCardId(null);
    setPreviewSlotId(null);
  };

  const handleUnrosterCard = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.card) return;

    const cardToUnroster = slot.card;

    // Mark card as unrostering (for animation state)
    setUnrosteringCardId(cardToUnroster.id);

    // Add card back to hand immediately (this triggers the layout animation)
    setCards(prev => [...prev, cardToUnroster]);

    // Calculate animation duration based on spring config
    const animationDuration = Math.max(
      500,
      (1000 * animationConfig.springDamping) / animationConfig.springStiffness * 10
    );

    // Delay removing card from slot to allow layout animation to complete
    setTimeout(() => {
      setSlots(prev =>
        prev.map(s =>
          s.id === slotId
            ? { ...s, card: null }
            : s
        )
      );
      setUnrosteringCardId(null);
    }, animationDuration);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Card Lab</h1>
        <div className="header-right">
          <PowerCounter value={totalPower} />
          <button
            className="config-button"
            onClick={() => setIsConfigOpen(true)}
          >
            ⚙️ Config
          </button>
        </div>
      </div>

      <SlotList
        slots={slots}
        previewSlotId={previewSlotId}
        animationConfig={animationConfig}
        onUnrosterCard={handleUnrosterCard}
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
        rosteringCardId={rosteringCardId}
        unrosteringCardId={unrosteringCardId}
        onSelectCard={handleSelectCard}
        animationConfig={animationConfig}
      />

      <ConfigPanel
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={animationConfig}
        onConfigChange={setAnimationConfig}
      />
    </div>
  );
}

export default App;
