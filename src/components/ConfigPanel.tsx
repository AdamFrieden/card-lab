import { motion, AnimatePresence } from 'framer-motion';
import type { AnimationConfig, TransitionType, BreathingStyle, TiltMode } from '../types';
import './ConfigPanel.css';

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: AnimationConfig;
  onConfigChange: (config: AnimationConfig) => void;
}

export function ConfigPanel({ isOpen, onClose, config, onConfigChange }: ConfigPanelProps) {
  const handleChange = (key: keyof AnimationConfig, value: number | string | boolean) => {
    onConfigChange({ ...config, [key]: value });
  };

  const transitionTypes: { value: TransitionType; label: string; description: string }[] = [
    { value: 'spring', label: 'Spring', description: 'Natural, physics-based motion' },
    { value: 'tween', label: 'Tween', description: 'Smooth, predictable timing' },
    { value: 'bounce', label: 'Bounce', description: 'Springy with extra bounce' },
    { value: 'elastic', label: 'Elastic', description: 'Exaggerated elastic motion' },
  ];

  const breathingStyles: { value: BreathingStyle; label: string; description: string }[] = [
    { value: 'gentle', label: 'Gentle', description: 'Subtle float and scale' },
    { value: 'wave', label: 'Wave', description: 'Cascading wave effect' },
    { value: 'pulse', label: 'Pulse', description: 'Synchronized breathing' },
    { value: 'drift', label: 'Drift', description: 'Slow horizontal drift' },
  ];

  const tiltModes: { value: TiltMode; label: string; description: string }[] = [
    { value: 'off', label: 'Off', description: 'No 3D tilt effect' },
    { value: 'selected', label: 'Selected', description: 'Tilt only selected cards' },
    { value: 'always', label: 'Always', description: 'Tilt all cards on hover' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="config-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="config-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="config-header">
              <h2>Animation Config</h2>
              <button onClick={onClose} className="close-button">✕</button>
            </div>

            <div className="config-content">
              <div className="config-group">
                <label>Transition Type</label>
                <div className="transition-buttons">
                  {transitionTypes.map((type) => (
                    <button
                      key={type.value}
                      className={`transition-button ${config.transitionType === type.value ? 'active' : ''}`}
                      onClick={() => handleChange('transitionType', type.value)}
                      title={type.description}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {config.transitionType === 'tween' && (
                <div className="config-group">
                  <label>
                    Duration (s)
                    <span className="config-value">{config.transitionDuration.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={config.transitionDuration}
                    onChange={(e) => handleChange('transitionDuration', parseFloat(e.target.value))}
                  />
                </div>
              )}

              {(config.transitionType === 'spring' || config.transitionType === 'bounce' || config.transitionType === 'elastic') && (
                <>
                  <div className="config-group">
                    <label>
                      Spring Stiffness
                      <span className="config-value">{config.springStiffness}</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={config.springStiffness}
                      onChange={(e) => handleChange('springStiffness', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="config-group">
                    <label>
                      Spring Damping
                      <span className="config-value">{config.springDamping}</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="1"
                      value={config.springDamping}
                      onChange={(e) => handleChange('springDamping', parseFloat(e.target.value))}
                    />
                  </div>
                </>
              )}

              <div className="config-group">
                <label>
                  Card Scale
                  <span className="config-value">{config.cardScale.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="1.5"
                  step="0.05"
                  value={config.cardScale}
                  onChange={(e) => handleChange('cardScale', parseFloat(e.target.value))}
                />
              </div>

              <div className="config-group">
                <label>
                  Card Lift (px)
                  <span className="config-value">{config.cardLift}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={config.cardLift}
                  onChange={(e) => handleChange('cardLift', parseFloat(e.target.value))}
                />
              </div>

              <div className="config-group">
                <label>
                  Stagger Delay (s)
                  <span className="config-value">{config.staggerDelay.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.2"
                  step="0.01"
                  value={config.staggerDelay}
                  onChange={(e) => handleChange('staggerDelay', parseFloat(e.target.value))}
                />
              </div>

              <div className="config-group">
                <label>
                  Card Breathing Effect
                  <span className="config-value">{config.enableBreathing ? 'On' : 'Off'}</span>
                </label>
                <button
                  className={`toggle-button ${config.enableBreathing ? 'active' : ''}`}
                  onClick={() => handleChange('enableBreathing', !config.enableBreathing)}
                >
                  {config.enableBreathing ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {config.enableBreathing && (
                <>
                  <div className="config-group">
                    <label>
                      Breathing Strength
                      <span className="config-value">{config.breathingStrength.toFixed(1)}x</span>
                    </label>
                    <input
                      type="range"
                      min="0.3"
                      max="2.5"
                      step="0.1"
                      value={config.breathingStrength}
                      onChange={(e) => handleChange('breathingStrength', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="config-group">
                    <label>Breathing Style</label>
                    <div className="breathing-style-buttons">
                      {breathingStyles.map((style) => (
                        <button
                          key={style.value}
                          className={`breathing-style-button ${config.breathingStyle === style.value ? 'active' : ''}`}
                          onClick={() => handleChange('breathingStyle', style.value)}
                          title={style.description}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="config-group">
                <label>3D Tilt Effect (Card Hand)</label>
                <div className="breathing-style-buttons">
                  {tiltModes.map((mode) => (
                    <button
                      key={mode.value}
                      className={`breathing-style-button ${config.tiltMode === mode.value ? 'active' : ''}`}
                      onClick={() => handleChange('tiltMode', mode.value)}
                      title={mode.description}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
