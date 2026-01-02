import { createContext, useContext, ReactNode } from 'react';
import type { Theme } from './types';
import { defaultTheme } from './defaultTheme';

// Create theme context
const ThemeContext = createContext<Theme>(defaultTheme);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

/**
 * ThemeProvider component
 * Wraps the app and provides theme context to all components
 */
export function ThemeProvider({ children, theme = defaultTheme }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme hook
 * Access the current theme from any component
 */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}

// Re-export everything for convenience
export { defaultTheme } from './defaultTheme';
export { blueTheme } from './themes/blueTheme';
export { woodlandTheme } from './themes/woodlandTheme';
export { withOpacity, hexToRgba, createGradient } from './utils';
export type { Theme } from './types';
