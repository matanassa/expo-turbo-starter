import type { AppTheme, breakpoints } from '@starter/theme';

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    dark: AppTheme;
    light: AppTheme;
  }

  // Unistyles uses interface declaration merging for application breakpoint names.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends Record<keyof typeof breakpoints, number> {}
}
