import { breakpoints, darkTheme, lightTheme } from '@starter/theme';
import { StyleSheet } from 'react-native-unistyles';

StyleSheet.configure({
  breakpoints,
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
  settings: {
    initialTheme: 'light',
  },
});
