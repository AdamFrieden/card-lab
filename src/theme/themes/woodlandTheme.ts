import type { Theme } from '../types';
import { createGradient, withOpacity } from '../utils';

/**
 * Woodland Paper Theme
 * Light, warm paper-based aesthetic with earthy browns and creams
 * Perfect for cozy woodland feel with readable text
 */

// Base color values from woodland paper aesthetic
const CREAM_LIGHT = '#faf5ef';        // Light cream background
const TAN_CARD = '#f5e6d3';           // Warm tan card background
const TAN_DARK = '#e8dfd0';           // Darker tan for accents
const BORDER_MEDIUM = '#d4c4b0';      // Medium tan border
const BORDER_DARK = '#8b7355';        // Dark brown border/accent
const TEXT_DARK = '#2d2520';          // Dark brown text
const TEXT_MEDIUM = '#6b5d52';        // Medium brown text
const TEXT_LIGHT = '#8b7355';         // Light brown text

export const woodlandTheme: Theme = {
  name: 'woodland',

  colors: {
    brand: {
      primary: BORDER_DARK,             // Dark brown as primary brand color
      primaryDark: TEXT_DARK,           // Darkest brown for emphasis
      primaryGradient: createGradient(BORDER_DARK, TEXT_DARK),
      secondary: BORDER_MEDIUM,         // Medium tan as secondary
      secondaryDark: TAN_DARK,          // Darker tan
      secondaryGradient: createGradient(BORDER_MEDIUM, TAN_DARK),
      accent: TEXT_LIGHT,               // Light brown accent
    },
    background: {
      app: CREAM_LIGHT,                 // Light cream main background
      panel: TAN_CARD,                  // Warm tan for panels
      card: TAN_CARD,                   // Warm tan for cards
    },
    text: {
      primary: TEXT_DARK,               // Dark brown primary text
      secondary: TEXT_MEDIUM,           // Medium brown secondary text
      tertiary: TEXT_LIGHT,             // Light brown tertiary text
    },
    overlay: {
      subtle: withOpacity(TEXT_DARK, 0.05),
      light: withOpacity(TEXT_DARK, 0.1),
      medium: withOpacity(TEXT_DARK, 0.2),
      strong: withOpacity(TEXT_DARK, 0.3),
    },
    border: {
      subtle: BORDER_MEDIUM,            // Medium tan default border
      default: BORDER_MEDIUM,           // Medium tan default border
      strong: BORDER_DARK,              // Dark brown strong border
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
    md: '6px',      // Woodland paper uses 6px consistently
    lg: '12px',
    xl: '16px',
    xxl: '20px',
    circle: '50%',
  },

  shadows: {
    card: '2px 3px 8px rgba(0, 0, 0, 0.12)',
    cardHover: '6px 10px 24px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)',
    cardSelected: '4px 6px 16px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.12)',
    button: '2px 3px 8px rgba(0, 0, 0, 0.12)',
    buttonGlow: '6px 10px 24px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)',
    panel: '0 -4px 20px rgba(0, 0, 0, 0.15)',
    glow: '2px 4px 12px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
    glowStrong: '3px 6px 16px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.12)',
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
