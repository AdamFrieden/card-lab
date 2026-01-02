import type { Theme } from '../types';
import { createGradient, withOpacity } from '../utils';

// Base color values for woodland theme - earthy, warm browns and greens
const BROWN_PRIMARY = '#8B6F47';      // Warm medium brown
const BROWN_DARK = '#5C4033';         // Deep bark brown
const GREEN_PRIMARY = '#7A9B76';      // Mossy sage green
const GREEN_DARK = '#4A6741';         // Forest green
const AMBER = '#D4A574';              // Golden amber/honey

export const woodlandTheme: Theme = {
  name: 'woodland',

  colors: {
    brand: {
      primary: BROWN_PRIMARY,
      primaryDark: BROWN_DARK,
      primaryGradient: createGradient(BROWN_PRIMARY, BROWN_DARK),
      secondary: GREEN_PRIMARY,
      secondaryDark: GREEN_DARK,
      secondaryGradient: createGradient(GREEN_PRIMARY, GREEN_DARK),
      accent: AMBER,
    },
    background: {
      app: 'linear-gradient(to bottom, #2d2416, #3d3028, #2a231a)',
      panel: 'linear-gradient(to bottom, #3d3028, #2d2416)',
      card: createGradient(BROWN_PRIMARY, BROWN_DARK),
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
    card: `0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px ${withOpacity(BROWN_DARK, 0.3)}`,
    cardHover: `0 6px 16px ${withOpacity(BROWN_PRIMARY, 0.6)}`,
    cardSelected: `0 16px 32px ${withOpacity(BROWN_PRIMARY, 0.5)}, 0 8px 16px rgba(0, 0, 0, 0.5), 0 0 30px ${withOpacity(AMBER, 0.6)}`,
    button: `0 4px 8px ${withOpacity(BROWN_PRIMARY, 0.2)}`,
    buttonGlow: `0 8px 24px ${withOpacity(BROWN_PRIMARY, 0.5)}, 0 0 16px ${withOpacity(AMBER, 0.3)}`,
    panel: '0 -4px 20px rgba(0, 0, 0, 0.4)',
    glow: `0 0 16px ${withOpacity(AMBER, 0.4)}`,
    glowStrong: `0 0 20px ${withOpacity(AMBER, 0.7)}`,
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
