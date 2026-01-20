# Encounter System - Refactoring & Cleanup Notes

## ✅ Completed: Animation Configuration System

### What Was Done
- Created centralized timing configuration at `src/config/encounterAnimationConfig.ts`
- Added 4 speed presets: `slow`, `medium`, `fast`, `instant`
- Updated `EncounterView` to use timing config throughout
- Added speed selector UI to `EncounterDemoView`

### Benefits
- **Single source of truth** for all animation timings
- **Easy to balance** - tweak one file instead of hunting through components
- **User control** - players can choose their preferred speed
- **Consistent feel** - all related animations scale together

---

## 🎯 Recommended Additional Refactoring

### 1. Extract Encounter Slot Component
**Current**: 100+ lines of inline JSX in `EncounterView.tsx` for player slots (duplicated for enemy)

**Suggested**:
```typescript
// src/components/encounter/EncounterSlot.tsx
interface EncounterSlotProps {
  slot: EncounterSlot;
  index: number;
  projection: ReturnType<typeof calculateSlotProjection>;
  isHighlighted: boolean;
  floatingLabels: FloatingLabel[];
  onSlotClick: (slotId: string) => void;
  phase: EncounterPhase;
  timings: EncounterAnimationTimings;
  side: 'player' | 'enemy';
}
```

**Benefits**:
- Reduces `EncounterView.tsx` from ~930 lines to ~600 lines
- Easier to test slot-level animations
- Reusable for future encounter variations

---

### 2. Create `useEncounterResolution` Hook
**Current**: ~80 lines of resolution logic inside `EncounterView`

**Suggested**:
```typescript
// src/hooks/useEncounterResolution.ts
export function useEncounterResolution(
  playerSlots: EncounterSlot[],
  enemySlots: EncounterSlot[],
  timings: EncounterAnimationTimings
) {
  // Contains: runResolution, handleSkip, state management
  return {
    phase,
    resolutionStep,
    animatingPlayerScore,
    animatingEnemyScore,
    finalPlayerScore,
    finalEnemyScore,
    showResult,
    runResolution,
    handleSkip,
  };
}
```

**Benefits**:
- Separates resolution logic from UI concerns
- Easier to test resolution sequence
- Could reuse for "auto-resolve" or "replay" features

---

### 3. Consolidate Floating Label System
**Current**: Inline motion.div with 80+ lines in `EncounterView.tsx`

**Suggested**:
```typescript
// src/components/encounter/FloatingLabel.tsx (already exists but unused)
// Update existing FloatingTraitLabel to accept timing prop
<FloatingTraitLabel
  text={label.text}
  amount={label.amount}
  color={label.color}
  duration={timings.floatingLabelDuration}
  onComplete={() => removeLabel(label.id)}
/>
```

**Current unused files**:
- `src/components/encounter/FloatingTraitLabel.tsx` - Created earlier but not used
- Should either use this component OR delete it

---

### 4. Type Safety for Animation Timings
**Current**: Components manually access timing values

**Suggested**:
```typescript
// Create a Context Provider
<EncounterTimingProvider speed={animationSpeed}>
  <EncounterView ... />
</EncounterTimingProvider>

// Then components can:
const timings = useEncounterTimings();
```

**Benefits**:
- No prop drilling
- Centralized timing updates
- Could add runtime timing tweaks for accessibility

---

## 🧹 Cleanup Opportunities

### Unused Code
1. **`FloatingTraitLabel.tsx`** - Created but not integrated
   - Either: Use it (replace inline labels)
   - Or: Delete it

2. **Hardcoded magic numbers** - Still exist in:
   - Empty slot pulse: `duration: 1.5` (line ~685)
   - Diff indicator JuicyNumber durations (not configurable)

### Code Duplication
1. **Player vs Enemy slot rendering** - 95% identical
   - Extract to `EncounterSlot` component with `side` prop

2. **Score display widgets** - Similar structure for player/enemy
   - Could extract to `ScoreDisplay` component

### Naming Inconsistencies
1. **Animation durations** - Mix of ms and seconds
   - `rollDelay: 400` (ms) vs `slotEntranceDuration: 0.3` (seconds)
   - Consistent in config, but easy to confuse

---

## 📊 File Size Analysis

### Large Files (Consider Splitting)
- **`EncounterView.tsx`**: ~930 lines
  - Resolution logic: ~80 lines
  - Player slots: ~150 lines
  - Enemy slots: ~100 lines
  - Floating labels: ~80 lines inline
  - Suggested target: < 500 lines (extract components)

### Well-Sized Files
- **`JuicyNumber.tsx`**: 115 lines ✅
- **`TickingNumber.tsx`**: 85 lines ✅
- **`VictoryBanner.tsx`**: 220 lines ✅
- **`ScoreProgressBar.tsx`**: 145 lines ✅

---

## 🎨 Future Enhancements

### Animation System
1. **Easing presets** - Add spring/bounce options
2. **Per-element timing overrides** - "Make trait bonuses slower but rolls faster"
3. **Animation disable** - Accessibility option for motion-sensitive users

### Performance
1. **Memoize slot components** - Prevent unnecessary re-renders during resolution
2. **Virtual scrolling** - If encounter supports 10+ slots
3. **Reduce layout thrashing** - Batch state updates in resolution

### Developer Experience
1. **Animation debugger** - Visual timeline of resolution sequence
2. **Timing presets** - Save/load custom timing configurations
3. **Animation recording** - Capture and export resolution as video

---

## 🚀 Migration Path (If Refactoring)

### Phase 1: Extract Components (Low Risk)
1. Create `EncounterSlot.tsx`
2. Create `ScoreDisplay.tsx`
3. Update `EncounterView` to use them
4. Test thoroughly

### Phase 2: Extract Logic (Medium Risk)
1. Create `useEncounterResolution` hook
2. Move resolution state/logic
3. Update `EncounterView` to use hook
4. Test resolution flow

### Phase 3: Context Provider (Low Risk)
1. Create `EncounterTimingContext`
2. Wrap `EncounterView`
3. Remove timing prop drilling
4. Test speed changes

---

## ✨ Current State Summary

The encounter system now has:
- ✅ **Configurable animation speeds** (slow/medium/fast/instant)
- ✅ **Centralized timing configuration**
- ✅ **User-facing speed controls**
- ✅ **Consistent animation scaling**
- ⚠️ **Some code duplication** (slots, score displays)
- ⚠️ **Large component file** (EncounterView.tsx)
- ⚠️ **Unused FloatingTraitLabel component**

The system is functional and maintainable, but could benefit from component extraction for long-term scalability.
