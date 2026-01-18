import { useState } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { FloatingNav } from './components/FloatingNav';
import { CardRosterView } from './views/CardRosterView';
import { SandboxView } from './views/SandboxView';
import { PackOpeningView } from './views/PackOpeningView';
import { VillageView } from './views/VillageView';
import { EncounterDemoView } from './views/EncounterDemoView';
import type { AnimationConfig } from './types';
import { DEFAULT_ANIMATION_CONFIG } from './types';
import { ThemeProvider, woodlandTheme, type Theme } from './theme';
import './App.css';

type ViewType = 'roster' | 'sandbox' | 'pack-opening' | 'village' | 'encounter';

function AppContent({ currentTheme, onThemeChange }: { currentTheme: Theme; onThemeChange: (theme: Theme) => void }) {
  const [currentView, setCurrentView] = useState<ViewType>('roster');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(DEFAULT_ANIMATION_CONFIG);

  return (
    <div className="app">
      {/* Floating Navigation */}
      <FloatingNav
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenConfig={() => setIsConfigOpen(true)}
      />

      {/* View Content - Full screen now! */}
      {currentView === 'roster' && <CardRosterView animationConfig={animationConfig} />}
      {currentView === 'pack-opening' && <PackOpeningView animationConfig={animationConfig} />}
      {currentView === 'village' && <VillageView animationConfig={animationConfig} />}
      {currentView === 'encounter' && <EncounterDemoView />}
      {currentView === 'sandbox' && <SandboxView animationConfig={animationConfig} />}

      {/* Config Panel */}
      <ConfigPanel
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={animationConfig}
        onConfigChange={setAnimationConfig}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      />
    </div>
  );
}

function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(woodlandTheme);

  return (
    <ThemeProvider theme={currentTheme}>
      <AppContent currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
    </ThemeProvider>
  );
}

export default App;
