/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#212121', // Dark Gray
    background: '#F5F5F5', // Light Gray
    tint: '#2196F3', // Blue
    icon: '#757575', // Medium Gray
    tabIconDefault: '#757575',
    tabIconSelected: '#2196F3',
    cardBackground: '#FFFFFF', // White
    borderColor: '#E0E0E0', // Lighter Gray
    // Status colors
    accentColor: '#2196F3', // Blue
    ratingText: '#FFA000', // Amber
    ratingBackground: 'rgba(255, 160, 0, 0.1)',
    transitStatusText: '#2196F3', // Blue
    transitStatusBackground: 'rgba(33, 150, 243, 0.1)',
    // New status colors for better harmony
    statusWarningText: '#FFA000', // Amber
    statusWarningBackground: 'rgba(255, 160, 0, 0.1)',
    statusInfoText: '#757575', // Medium Gray
    statusInfoBackground: '#F5F5F5',
  },
  dark: {
    text: '#E0E0E0', // Light Gray
    background: '#121212', // Very Dark Gray
    tint: '#2196F3', // Blue
    icon: '#9E9E9E', // Medium Gray
    tabIconDefault: '#9E9E9E',
    tabIconSelected: '#2196F3',
    cardBackground: '#1E1E1E', // Dark Gray
    borderColor: '#424242', // Lighter Dark Gray
    // Status colors
    accentColor: '#2196F3', // Blue
    ratingText: '#FFC107', // Amber
    ratingBackground: 'rgba(255, 193, 7, 0.1)',
    transitStatusText: '#64B5F6', // Light Blue
    transitStatusBackground: 'rgba(100, 181, 246, 0.1)',
    // New status colors for better harmony
    statusWarningText: '#FFC107', // Amber
    statusWarningBackground: 'rgba(255, 193, 7, 0.1)',
    statusInfoText: '#9E9E9E', // Medium Gray
    statusInfoBackground: '#424242',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
