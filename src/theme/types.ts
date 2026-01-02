export interface Theme {
  name: string;

  colors: {
    brand: {
      primary: string;           // Base purple: #667eea
      primaryDark: string;        // Dark purple: #764ba2
      primaryGradient: string;    // Main gradient
      secondary: string;          // Pink: #f093fb
      secondaryDark: string;      // Dark pink: #f5576c
      secondaryGradient: string;  // Pink gradient
      accent: string;             // Gold: #ffd700
    };
    background: {
      app: string;                // Main app background gradient
      panel: string;              // Panel/modal background
      card: string;               // Card background (usually gradient)
    };
    text: {
      primary: string;            // Main text (white 0.87)
      secondary: string;          // Secondary text (white 0.7)
      tertiary: string;           // Tertiary text (white 0.6)
    };
    overlay: {
      subtle: string;             // rgba(255, 255, 255, 0.05)
      light: string;              // rgba(255, 255, 255, 0.1)
      medium: string;             // rgba(255, 255, 255, 0.2)
      strong: string;             // rgba(255, 255, 255, 0.3)
    };
    border: {
      subtle: string;             // rgba(255, 255, 255, 0.1)
      default: string;            // rgba(255, 255, 255, 0.2)
      strong: string;             // rgba(255, 255, 255, 0.3)
    };
  };

  spacing: {
    xs: string;    // 4px
    sm: string;    // 8px
    md: string;    // 12px
    lg: string;    // 16px
    xl: string;    // 20px
    xxl: string;   // 32px
    xxxl: string;  // 40px
  };

  radius: {
    sm: string;      // 6px
    md: string;      // 8px
    lg: string;      // 12px
    xl: string;      // 16px
    xxl: string;     // 20px
    circle: string;  // 50%
  };

  shadows: {
    card: string;                 // Default card shadow
    cardHover: string;            // Card hover state
    cardSelected: string;         // Selected card
    button: string;               // Button shadow
    buttonGlow: string;           // Button with glow effect
    panel: string;                // Panel/modal shadow
    glow: string;                 // Generic glow effect
    glowStrong: string;           // Strong glow
  };

  zIndex: {
    card: number;        // 1
    slot: number;        // 5
    slotCard: number;    // 10
    button: number;      // 20
    buttonHigh: number;  // 40
    hand: number;        // 50
    overlay: number;     // 100
    modal: number;       // 101
  };

  typography: {
    fontSize: {
      xs: string;    // 12px
      sm: string;    // 13px
      base: string;  // 14px
      md: string;    // 16px
      lg: string;    // 18px
      xl: string;    // 20px
      xxl: string;   // 24px
      xxxl: string;  // 28px
    };
    fontWeight: {
      normal: number;    // 400
      medium: number;    // 500
      semibold: number;  // 600
      bold: number;      // 700
    };
  };

  dimensions: {
    card: {
      width: number;   // 140
      height: number;  // 200
    };
    pack: {
      width: number;   // 200
      height: number;  // 280
    };
  };
}
