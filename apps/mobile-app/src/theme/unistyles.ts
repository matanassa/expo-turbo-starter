import { breakpoints, darkTheme, lightTheme, type AppTheme } from '@starter/theme';
import { StyleSheet } from 'react-native-unistyles';

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    dark: AppTheme;
    light: AppTheme;
  }

  // Unistyles uses interface declaration merging for application breakpoint names.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends Record<keyof typeof breakpoints, number> {}
}

StyleSheet.configure({
  breakpoints,
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
  settings: {
    adaptiveThemes: true,
  },
});
