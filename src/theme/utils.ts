/**
 * Add opacity to a color string
 * Supports hex colors and rgb/rgba colors
 */
export function withOpacity(color: string, opacity: number): string {
  // If already rgba, replace the alpha value
  if (color.startsWith('rgba(')) {
    return color.replace(/[\d.]+\)$/g, `${opacity})`);
  }

  // If rgb, convert to rgba
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }

  // If hex, convert to rgba
  if (color.startsWith('#')) {
    return hexToRgba(color, opacity);
  }

  // Fallback: assume it's a named color, wrap in rgba
  return `rgba(${color}, ${opacity})`;
}

/**
 * Convert hex color to rgba with specified opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse hex values
  let r: number, g: number, b: number;

  if (hex.length === 3) {
    // Short hex like #fff
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    // Full hex like #ffffff
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Create a linear gradient string
 */
export function createGradient(
  from: string,
  to: string,
  angle: number = 135
): string {
  return `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`;
}
