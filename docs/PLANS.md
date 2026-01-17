## PLAN NOTES

### Demo App Goals
- Show that react and framer motion can achieve a good-enough UI interaction for the game
- Provide example scenes that demonstrate core behavior and components so we can test and iterate quickly and easily

### What We Have
 - Example Pack Opening with juicy animation
 - Basic Roster/Hand interaction example
 - Partial Village with baseline game behavior - showing critters, gear, builds, acorns, packs

### Next Up To Do
- Some way to demo and iterate on a core encounter loop
- Some way to demo and iterate on core game progression
- Break up into more reusable components - card from pack, hand, slot, village should be reusing as much as possible
- Build polished, modular components that can be composed

### Long Term Features To Scope Out
- Server-authoritative state and interactions
- SSO with Google
- Basic monetization example
- Leaderboard
- PvP with Matchmaking


=============

demo encounter loop

1) a vertical setup view with a start button
- make some selections
- hit start -> send configuration to encounter view

2) a vertical encounter view (similar to fantasty football layout)
- scrolling list of slot pairs (left side is your team, right side is enemy)
- encounter slots start full for enemies, empty for your slots
- allows rostering your critter crew into empty slots on your side
- projected totals animate as you add/remove critters
- hitting 'go' locks in the selections, 'rolls' through the encounter animating + resolving it.
- (tap to move the animation along faster?)
- final result interaction appears on-screen (or as part of the vertical setup view we return to?)


ok the next demo view we want to create will be a bit more involved. first I'll describe the intended use, and then we'll come up with the first steps to scaffold out the components so we can tackle each smaller piece step-by-step



