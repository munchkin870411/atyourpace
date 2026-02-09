export interface ColorTheme {
  primary: string;        // Base color
  light: string;         // Lighter version for backgrounds
  lighter: string;       // Even lighter for containers
  lightest: string;      // Lightest for subtle backgrounds
  dark: string;          // Darker for borders
  darker: string;        // Even darker for emphasis
  darkest: string;       // Darkest for important buttons
  textColor: string;     // Text color (white in dark mode, black in light mode)
}

// Convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 128, b: 0 };
};

// Convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Lighten a color by a percentage
const lighten = (hex: string, percent: number): string => {
  const { r, g, b } = hexToRgb(hex);
  const amount = ((255 - Math.max(r, g, b)) * percent) / 100;
  return rgbToHex(r + amount, g + amount, b + amount);
};

// Mix color with white for very light tints
const mixWithWhite = (hex: string, whitePercent: number): string => {
  const { r, g, b } = hexToRgb(hex);
  const white = 255;
  const mixedR = r + (white - r) * (whitePercent / 100);
  const mixedG = g + (white - g) * (whitePercent / 100);
  const mixedB = b + (white - b) * (whitePercent / 100);
  return rgbToHex(mixedR, mixedG, mixedB);
};

// Darken a color by a percentage
const darken = (hex: string, percent: number): string => {
  const { r, g, b } = hexToRgb(hex);
  const amount = (Math.max(r, g, b) * percent) / 100;
  return rgbToHex(r - amount, g - amount, b - amount);
};

// Add alpha to hex color
export const addAlpha = (hex: string, alpha: number): string => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Generate a complete color theme from a base color
export const generateColorTheme = (baseColor: string): ColorTheme => {
  // Check if this is the dark mode color
  const isDarkMode = baseColor.toUpperCase() === '#909090';
  
  if (isDarkMode) {
    // Dark mode theme with darker backgrounds and white text
    return {
      primary: '#505050',
      light: '#2C2C2C',           // Dark background
      lighter: '#252525',         // Darker for containers
      lightest: '#1E1E1E',        // Darkest background
      dark: '#707070',            // Lighter borders in dark mode
      darker: '#808080',          // Lighter emphasis
      darkest: '#484848',         // Darker buttons
      textColor: '#B0B0B0',       // Light gray text in dark mode
    };
  } else {
    // Light mode: create lighter variants (original behavior)
    const adjustedBase = lighten(baseColor, 15);
    
    return {
      primary: adjustedBase,
      light: lighten(adjustedBase, 35),
      lighter: lighten(adjustedBase, 60),
      lightest: mixWithWhite(adjustedBase, 85),
      dark: darken(adjustedBase, 8),
      darker: darken(adjustedBase, 15),
      darkest: darken(adjustedBase, 25),
      textColor: '#000000',       // Black text in light mode
    };
  }
};
