import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, withOpacity } from '../theme';

type ViewType = 'roster' | 'sandbox' | 'pack-opening' | 'village';

interface FloatingNavProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onOpenConfig: () => void;
}

const views = [
  { id: 'roster' as ViewType, label: 'Card Roster', emoji: '🎴' },
  { id: 'pack-opening' as ViewType, label: 'Pack Opening', emoji: '🎁' },
  { id: 'village' as ViewType, label: 'Village', emoji: '🏘️' },
  { id: 'sandbox' as ViewType, label: 'Sandbox', emoji: '🧪' },
];

export function FloatingNav({ isOpen, onToggle, currentView, onViewChange, onOpenConfig }: FloatingNavProps) {
  const theme = useTheme();

  return (
    <>
      {/* Hamburger Toggle Button */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isOpen ? 90 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          position: 'fixed',
          top: theme.spacing.lg,
          right: theme.spacing.lg,
          width: 48,
          height: 48,
          borderRadius: theme.radius.circle,
          background: theme.colors.overlay.medium,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.colors.border.default}`,
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: `0 4px 16px ${withOpacity(theme.colors.brand.primary, 0.2)}`,
          zIndex: theme.zIndex.modal,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isOpen ? '✕' : '☰'}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(2px)',
                zIndex: theme.zIndex.overlay,
              }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                position: 'fixed',
                top: `calc(${theme.spacing.lg} + 60px)`,
                right: theme.spacing.lg,
                minWidth: 220,
                background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
                backdropFilter: 'blur(20px)',
                borderRadius: theme.radius.lg,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                border: `1px solid ${theme.colors.border.subtle}`,
                overflow: 'hidden',
                zIndex: theme.zIndex.modal,
              }}
            >
              {/* Header */}
              <div style={{
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                borderBottom: `1px solid ${theme.colors.border.subtle}`,
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: theme.typography.fontSize.lg,
                  color: 'white',
                  fontWeight: theme.typography.fontWeight.semibold,
                }}>
                  Card Lab
                </h3>
              </div>

              {/* View Buttons */}
              <div style={{ padding: theme.spacing.sm }}>
                {views.map((view) => (
                  <motion.button
                    key={view.id}
                    onClick={() => {
                      onViewChange(view.id);
                      onToggle();
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.md,
                      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                      background: currentView === view.id
                        ? withOpacity(theme.colors.brand.primary, 0.2)
                        : 'transparent',
                      border: currentView === view.id
                        ? `1px solid ${withOpacity(theme.colors.brand.primary, 0.4)}`
                        : '1px solid transparent',
                      borderRadius: theme.radius.md,
                      color: currentView === view.id ? 'white' : theme.colors.text.secondary,
                      fontSize: theme.typography.fontSize.base,
                      fontWeight: currentView === view.id ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{view.emoji}</span>
                    {view.label}
                  </motion.button>
                ))}
              </div>

              {/* Config Button */}
              <div style={{
                padding: theme.spacing.sm,
                borderTop: `1px solid ${theme.colors.border.subtle}`,
              }}>
                <motion.button
                  onClick={() => {
                    onOpenConfig();
                    onToggle();
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    background: 'transparent',
                    border: '1px solid transparent',
                    borderRadius: theme.radius.md,
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.base,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>⚙️</span>
                  Animation Config
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
