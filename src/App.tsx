import { useState } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { CardRosterView } from './views/CardRosterView';
import { SandboxView } from './views/SandboxView';
import { PackOpeningView } from './views/PackOpeningView';
import type { AnimationConfig } from './types';
import { DEFAULT_ANIMATION_CONFIG } from './types';
import { ThemeProvider, useTheme, withOpacity, defaultTheme, blueTheme, type Theme } from './theme';
import './App.css';

type ViewType = 'roster' | 'sandbox' | 'pack-opening';

function AppContent({ currentTheme, onThemeChange }: { currentTheme: Theme; onThemeChange: (theme: Theme) => void }) {
  const theme = useTheme();
  const [currentView, setCurrentView] = useState<ViewType>('roster');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(DEFAULT_ANIMATION_CONFIG);

  return (
    <div className="app">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.colors.border.subtle}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xl }}>
          <h1 style={{
            margin: 0,
            fontSize: theme.typography.fontSize.xxl,
            color: 'white',
            fontWeight: theme.typography.fontWeight.bold,
          }}>
            Card Lab
          </h1>
          <div style={{ display: 'flex', gap: theme.spacing.sm }}>
            <button
              style={{
                background: currentView === 'roster'
                  ? withOpacity(theme.colors.brand.primary, 0.3)
                  : theme.colors.overlay.light,
                border: `1px solid ${currentView === 'roster'
                  ? withOpacity(theme.colors.brand.primary, 0.5)
                  : theme.colors.border.default}`,
                color: currentView === 'roster' ? 'white' : theme.colors.text.secondary,
                padding: `6px ${theme.spacing.lg}`,
                borderRadius: theme.radius.sm,
                fontSize: theme.typography.fontSize.base,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setCurrentView('roster')}
            >
              Card Roster
            </button>
            <button
              style={{
                background: currentView === 'pack-opening'
                  ? withOpacity(theme.colors.brand.primary, 0.3)
                  : theme.colors.overlay.light,
                border: `1px solid ${currentView === 'pack-opening'
                  ? withOpacity(theme.colors.brand.primary, 0.5)
                  : theme.colors.border.default}`,
                color: currentView === 'pack-opening' ? 'white' : theme.colors.text.secondary,
                padding: `6px ${theme.spacing.lg}`,
                borderRadius: theme.radius.sm,
                fontSize: theme.typography.fontSize.base,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setCurrentView('pack-opening')}
            >
              Pack Opening
            </button>
            <button
              style={{
                background: currentView === 'sandbox'
                  ? withOpacity(theme.colors.brand.primary, 0.3)
                  : theme.colors.overlay.light,
                border: `1px solid ${currentView === 'sandbox'
                  ? withOpacity(theme.colors.brand.primary, 0.5)
                  : theme.colors.border.default}`,
                color: currentView === 'sandbox' ? 'white' : theme.colors.text.secondary,
                padding: `6px ${theme.spacing.lg}`,
                borderRadius: theme.radius.sm,
                fontSize: theme.typography.fontSize.base,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setCurrentView('sandbox')}
            >
              Sandbox
            </button>
          </div>
        </div>
        <button
          style={{
            background: withOpacity(theme.colors.brand.primary, 0.2),
            border: `1px solid ${withOpacity(theme.colors.brand.primary, 0.4)}`,
            color: 'white',
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            borderRadius: theme.radius.md,
            fontSize: theme.typography.fontSize.base,
            cursor: 'pointer',
          }}
          onClick={() => setIsConfigOpen(true)}
        >
          ⚙️ Config
        </button>
      </div>

      {currentView === 'roster' && <CardRosterView animationConfig={animationConfig} />}
      {currentView === 'pack-opening' && <PackOpeningView animationConfig={animationConfig} />}
      {currentView === 'sandbox' && <SandboxView animationConfig={animationConfig} />}

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
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  return (
    <ThemeProvider theme={currentTheme}>
      <AppContent currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
    </ThemeProvider>
  );
}

export default App;
