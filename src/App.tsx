import { useState } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { CardRosterView } from './views/CardRosterView';
import { SandboxView } from './views/SandboxView';
import { PackOpeningView } from './views/PackOpeningView';
import type { AnimationConfig } from './types';
import { DEFAULT_ANIMATION_CONFIG } from './types';
import './App.css';

type ViewType = 'roster' | 'sandbox' | 'pack-opening';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('roster');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(DEFAULT_ANIMATION_CONFIG);

  return (
    <div className="app">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1>Card Lab</h1>
          <div className="tabs">
            <button
              className={`tab ${currentView === 'roster' ? 'active' : ''}`}
              onClick={() => setCurrentView('roster')}
            >
              Card Roster
            </button>
            <button
              className={`tab ${currentView === 'pack-opening' ? 'active' : ''}`}
              onClick={() => setCurrentView('pack-opening')}
            >
              Pack Opening
            </button>
            <button
              className={`tab ${currentView === 'sandbox' ? 'active' : ''}`}
              onClick={() => setCurrentView('sandbox')}
            >
              Sandbox
            </button>
          </div>
        </div>
        <button
          className="config-button"
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
      />
    </div>
  );
}

export default App;
