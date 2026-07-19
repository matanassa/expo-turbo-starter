import { breakpoints } from './breakpoints';
import { darkColors, lightColors, type ThemeColors } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { space, spacing } from './spacing';
import { typography } from './typography';

export type AppTheme = {
  colors: ThemeColors;
  radius: typeof radius;
  shadows: typeof shadows;
  space: typeof space;
  spacing: typeof spacing;
  typography: typeof typography;
};

const foundations = {
  radius,
  shadows,
  space,
  spacing,
  typography,
};

export const lightTheme = {
  ...foundations,
  colors: lightColors,
} satisfies AppTheme;

export const darkTheme = {
  ...foundations,
  colors: darkColors,
} satisfies AppTheme;

export { breakpoints };
