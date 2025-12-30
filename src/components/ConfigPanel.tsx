import { motion, AnimatePresence } from 'framer-motion';
import type { AnimationConfig } from '../types';
import './ConfigPanel.css';

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: AnimationConfig;
  onConfigChange: (config: AnimationConfig) => void;
}

export function ConfigPanel({ isOpen, onClose, config, onConfigChange }: ConfigPanelProps) {
  const handleChange = (key: keyof AnimationConfig, value: number) => {
    onConfigChange({ ...config, [key]: value });
  };

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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
