import type { Theme } from '../types';
import { createGradient, withOpacity } from '../utils';

// Base color values for blue theme
const BLUE_PRIMARY = '#4A90E2';
const BLUE_DARK = '#2E5C8A';
const CYAN_PRIMARY = '#50E3C2';
const CYAN_DARK = '#2AB398';
const ORANGE = '#F5A623';

export const blueTheme: Theme = {
  name: 'blue',

  colors: {
    brand: {
      primary: BLUE_PRIMARY,
      primaryDark: BLUE_DARK,
      primaryGradient: createGradient(BLUE_PRIMARY, BLUE_DARK),
      secondary: CYAN_PRIMARY,
      secondaryDark: CYAN_DARK,
      secondaryGradient: createGradient(CYAN_PRIMARY, CYAN_DARK),
      accent: ORANGE,
    },
    background: {
      app: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)',
      panel: 'linear-gradient(to bottom, #16213e, #0f3460)',
      card: createGradient(BLUE_PRIMARY, BLUE_DARK),
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.6)',
    },
    overlay: {
      subtle: 'rgba(255, 255, 255, 0.05)',
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      strong: 'rgba(255, 255, 255, 0.3)',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.1)',
      default: 'rgba(255, 255, 255, 0.2)',
      strong: 'rgba(255, 255, 255, 0.3)',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '32px',
    xxxl: '40px',
  },

  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '20px',
    circle: '50%',
  },

  shadows: {
    card: `0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px ${withOpacity(BLUE_PRIMARY, 0.2)}`,
    cardHover: `0 6px 16px ${withOpacity(BLUE_PRIMARY, 0.6)}`,
    cardSelected: `0 16px 32px ${withOpacity(BLUE_PRIMARY, 0.5)}, 0 8px 16px rgba(0, 0, 0, 0.4), 0 0 30px ${withOpacity(BLUE_PRIMARY, 0.8)}`,
    button: `0 4px 8px ${withOpacity(BLUE_PRIMARY, 0.2)}`,
    buttonGlow: `0 8px 24px ${withOpacity(BLUE_PRIMARY, 0.5)}, 0 0 16px ${withOpacity(BLUE_PRIMARY, 0.3)}`,
    panel: '0 -4px 20px rgba(0, 0, 0, 0.3)',
    glow: `0 0 16px ${withOpacity(BLUE_PRIMARY, 0.3)}`,
    glowStrong: `0 0 20px ${withOpacity(BLUE_PRIMARY, 0.6)}`,
  },

  zIndex: {
    card: 1,
    slot: 5,
    slotCard: 10,
    button: 20,
    buttonHigh: 40,
    hand: 50,
    overlay: 100,
    modal: 101,
  },

  typography: {
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '28px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  dimensions: {
    card: {
      width: 140,
      height: 200,
    },
    pack: {
      width: 200,
      height: 280,
    },
  },
};
