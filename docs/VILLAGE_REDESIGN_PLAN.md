# Village UI Redesign Plan

## 🎯 Project Goal

Transform the Village view from a dark neon-themed UI into a **splashy, minimalist, crunchy paper-card experience** with:
- Warm tan/cream color palette
- Paper-like aesthetics with subtle 3D effects
- Asymmetric, organic layouts
- Delightful Framer Motion animations
- Tactile, satisfying interactions

---

## 🎨 Design Philosophy

**Keywords:** Minimal, Clean, Paper, Asymmetric, Crunchy, Tactile, Splashy

**Inspiration:** Physical paper cards with natural imperfections, trading card games, tactile board game components

---

## ✅ Implementation Checklist

### **Phase 1: Color Palette Overhaul**
- [ ] Replace dark backgrounds with warm tan/cream tones (`#f5e6d3`, `#faf5ef`)
- [ ] Add soft brown/coffee accents (`#8b7355`, `#a89080`)
- [ ] Update text colors to dark brown/black for contrast
- [ ] Remove neon purple gradients from pack shop buttons
- [ ] Replace gradient backgrounds with solid cream/tan

### **Phase 2: Paper/Card Aesthetic**
- [ ] Transform ExpandableList sections to paper cards
  - [ ] Add paper-like shadows: `2px 4px 12px rgba(0,0,0,0.15)`
  - [ ] Subtle irregular corners or sharp edges with minimal rounding (4-8px)
  - [ ] Off-white/cream background
  - [ ] Subtle border styling
- [ ] Add paper grain texture or noise overlay
- [ ] Implement asymmetric staggered layout
  - [ ] Alternate sections left/right positioning
  - [ ] Variable margins (10px left, then 10px right)
- [ ] Add subtle idle rotation to each section
  - [ ] Critters: `-1deg`
  - [ ] Buildings: `0.5deg`
  - [ ] Gear: `-0.5deg`

### **Phase 3: 3D Tilt & Perspective**
- [ ] Add `perspective: 1000px` to container
- [ ] Implement subtle `rotateX` and `rotateY` idle animations (±1-2 degrees)
- [ ] Use `transformStyle: preserve-3d` for depth
- [ ] Stagger timing so sections animate out of sync
- [ ] Add `will-change` hints for performance

### **Phase 4: Interactive Animations (ExpandableList)**
- [ ] **Hover "pop" effect:**
  - [ ] Scale up to `1.05`
  - [ ] Straighten rotation to `0deg`
  - [ ] Lift shadow higher
  - [ ] Spring animation: `stiffness: 400, damping: 17`
- [ ] **Tap feedback:**
  - [ ] `whileTap: { scale: 0.97, rotate: 0 }`
- [ ] **Expand/collapse enhancements:**
  - [ ] Replace linear with bouncy spring
  - [ ] Stagger children: `staggerChildren: 0.05`
  - [ ] Each card slides up + fades: `y: 20, opacity: 0` → `y: 0, opacity: 1`

### **Phase 5: Currency & Pack Cards**
- [ ] Add gentle floating idle animation (slow y-axis)
- [ ] Implement value change animations
  - [ ] Scale pulse on change: `scale: [1, 1.1, 1]`
  - [ ] Color flash effect (gold flash on acorn gain)
- [ ] Add rotate and shake effect on pack purchase
- [ ] Number slot machine roll effect for dramatic changes
- [ ] Asymmetric positioning (one card slightly higher)

### **Phase 6: Shop Pack Buttons**
- [ ] Remove gradient backgrounds
- [ ] Apply cream/tan with dark border
- [ ] **Hover effects:**
  - [ ] Slight tilt up: `rotateX: -5deg`
  - [ ] Lift shadow
  - [ ] Spring animation
- [ ] **Click/tap effect:**
  - [ ] Stamp down: `scale: 0.95`
  - [ ] Shadow reduces momentarily
- [ ] **Disabled state:**
  - [ ] Faded appearance
  - [ ] Slightly rotated down
- [ ] Add confetti/particle burst on successful purchase

### **Phase 7: VillageCard Improvements**
- [ ] Apply paper card aesthetic with light shadow
- [ ] **Hover interactions:**
  - [ ] Lift up: `translateY: -4px`
  - [ ] Increase shadow depth
  - [ ] Slight tilt based on mouse position
- [ ] Add thin dark brown border stroke
- [ ] Implement staggered idle animations
  - [ ] Per-card subtle rotate: `[-0.5deg, 0.5deg]`
  - [ ] Offset by index for wave effect
- [ ] Update colors to match new palette

### **Phase 8: Micro-interactions**
- [ ] **Emoji icons:**
  - [ ] Gentle bounce on hover
  - [ ] Rotate/wiggle when section expands
- [ ] **Expand arrow:**
  - [ ] Add bounce effect on rotation
  - [ ] Anticipation: slight move up before rotating down
- [ ] **Typography:**
  - [ ] Use bold weights for headers
  - [ ] Tight letter-spacing for impact
  - [ ] Subtle text shadows for depth

### **Phase 9: Layout & Spacing**
- [ ] Break perfect symmetry throughout
- [ ] Implement organic spacing (variable gaps: 16px, 20px, 18px)
- [ ] Offset pack shop slightly from center
- [ ] Variable gaps between cards in lists

### **Phase 10: Performance & Polish**
- [ ] Add `layoutId` for smooth transitions
- [ ] Optimize with `will-change` hints
- [ ] Implement `prefers-reduced-motion` accessibility check
- [ ] Test on mobile devices
- [ ] Optimize animation performance

### **Phase 11: Special Effects (Optional)**
- [ ] Paper crinkle texture shift on interaction
- [ ] Slight brightness change for light reflection simulation
- [ ] Stack effect for expanded lists (multiple shadow layers)
- [ ] Sound effects:
  - [ ] Paper rustle on expand/collapse
  - [ ] Coin clink on pack purchase
  - [ ] Satisfying "pop" on button press

---

## 📋 Component Files to Modify

1. **VillageView.tsx** - Main view container, currency cards, shop buttons
2. **ExpandableList.tsx** - Paper card sections, expand/collapse animations
3. **VillageCard.tsx** - Individual item cards in scrollable lists
4. **App.css** (or new VillageView.css) - Background colors, base styles

---

## 🎨 Color Palette Reference

### Primary Colors
- **Background:** `#faf5ef` (light cream)
- **Card Background:** `#f5e6d3` (warm tan)
- **Accent:** `#8b7355` (soft brown)
- **Border:** `#d4c4b0` (tan border)
- **Text Primary:** `#2d2520` (dark brown/black)
- **Text Secondary:** `#6b5d52` (medium brown)

### Shadows
- **Card Shadow:** `2px 4px 12px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)`
- **Hover Shadow:** `4px 8px 20px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.15)`
- **Active Shadow:** `1px 2px 6px rgba(0, 0, 0, 0.1)`

---

## 🚀 Implementation Priority

### High Priority (Maximum Visual Impact)
1. Color palette overhaul
2. Paper card aesthetics for ExpandableList
3. "Pop" hover animations
4. Pack shop button redesign

### Medium Priority (Enhanced Experience)
5. Asymmetric layout and idle animations
6. VillageCard improvements
7. Currency card animations
8. Micro-interactions

### Low Priority (Polish)
9. 3D perspective effects
10. Advanced animations (slot machine, confetti)
11. Sound effects
12. Special texture effects

---

## 💡 Ideas & Notes

### Animation Timing Reference
- **Idle animations:** 3-5 seconds, infinite loop
- **Hover:** 0.3s spring
- **Tap:** 0.15s spring
- **Expand:** 0.4s ease-out with stagger

### Technical Considerations
- Use `transform` and `opacity` for performant animations
- Avoid animating `width`, `height`, or `top/left` directly
- Mobile: reduce animation complexity if needed
- Consider battery life on mobile devices

---

## 📝 Future Enhancements

- [ ] Add paper texture image overlay
- [ ] Implement drag-to-reorder for collections
- [ ] Add parallax scrolling effects
- [ ] Seasonal theme variations (autumn, winter, etc.)
- [ ] Achievement badges with paper stamp aesthetic
- [ ] Animated transitions between views
- [ ] Styling refactors to require fewer changes to iterate on UX
- [ ] 'Pack Shop' that is more in-theme and has a drag-to-purchase interaction

---

**Last Updated:** 2026-01-13
**Status:** Planning Phase
