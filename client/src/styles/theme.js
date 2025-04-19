// Theme inspired by Linear app, Arc browser, Notion, and Figma

export const lightTheme = {
  // Base colors
  primary: '#FF9A8B', // Soft coral
  secondary: '#CABDFF', // Soft purple
  accent: '#FF6B8B', // Coral pink
  
  // UI colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9F9FB',
    tertiary: '#F5F5F7',
    modal: 'rgba(255, 255, 255, 0.8)'
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#F9F9FB',
    tertiary: '#F5F5F7',
    quaternary: '#EEEEF0'
  },
  
  // Text colors
  text: {
    primary: '#1C1C1E',
    secondary: '#48484A',
    tertiary: '#8A8A8E',
    quaternary: '#AEAEB2',
    inverted: '#FFFFFF'
  },
  
  // Border colors
  border: {
    primary: '#E3E3E5',
    secondary: '#EEEEF0',
    tertiary: '#F5F5F7',
    focus: '#CABDFF'
  },
  
  // Status colors
  status: {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#0084FF'
  },
  
  // Shadows
  shadow: {
    small: '0 2px 8px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.08)',
    large: '0 8px 24px rgba(0, 0, 0, 0.12)',
    focus: '0 0 0 4px rgba(202, 189, 255, 0.3)'
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }
};

export const darkTheme = {
  // Base colors
  primary: '#FF9A8B', // Keep the same coral for brand consistency
  secondary: '#CABDFF', // Keep the same purple for brand consistency
  accent: '#FF6B8B', // Keep the same coral pink for brand consistency
  
  // UI colors
  background: {
    primary: '#1C1C1E',
    secondary: '#2C2C2E',
    tertiary: '#3A3A3C',
    modal: 'rgba(28, 28, 30, 0.8)'
  },
  surface: {
    primary: '#2C2C2E',
    secondary: '#3A3A3C',
    tertiary: '#48484A',
    quaternary: '#636366'
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#AEAEB2',
    quaternary: '#8A8A8E',
    inverted: '#1C1C1E'
  },
  
  // Border colors
  border: {
    primary: '#3A3A3C',
    secondary: '#48484A',
    tertiary: '#636366',
    focus: '#CABDFF'
  },
  
  // Status colors
  status: {
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF'
  },
  
  // Shadows
  shadow: {
    small: '0 2px 8px rgba(0, 0, 0, 0.2)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.4)',
    large: '0 8px 24px rgba(0, 0, 0, 0.6)',
    focus: '0 0 0 4px rgba(202, 189, 255, 0.3)'
  },
  
  // Animation (same as light theme)
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }
};