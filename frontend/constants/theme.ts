/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1F2937', // Closest to slate-900 from TailwindCSS
    background: '#f6f8f7', // background-light
    tint: '#10b77f', // primary
    icon: '#6B7280', // Closest to slate-500
    tabIconDefault: '#6B7280', // slate-500
    tabIconSelected: '#10b77f', // primary
    cardBackground: '#FFFFFF',
    borderColor: '#E5E7EB', // gray-200
    ratingBackground: 'rgba(253, 224, 71, 0.2)', // yellow-400/20
    ratingText: '#D97706', // yellow-600
    transitStatusBackground: 'rgba(59, 130, 246, 0.1)', // blue-500/10
    transitStatusText: '#3B82F6', // blue-500
    accentColor: '#10b77f', // primary
  },
  dark: {
    text: '#FFFFFF', // white
    background: '#10221c', // background-dark
    tint: '#10b77f', // primary
    icon: '#9CA3AF', // Closest to slate-400
    tabIconDefault: '#9CA3AF', // slate-400
    tabIconSelected: '#10b77f', // primary
    cardBackground: '#0F172A', // trust-blue
    borderColor: 'rgba(255, 255, 255, 0.05)', // white/5
    ratingBackground: 'rgba(253, 224, 71, 0.2)', // yellow-400/20 (assuming same in dark mode)
    ratingText: '#FACC15', // yellow-400 (adjusted for better contrast)
    transitStatusBackground: 'rgba(59, 130, 246, 0.1)', // blue-500/10
    transitStatusText: '#3B82F6', // blue-500
    accentColor: '#10b77f', // primary
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
