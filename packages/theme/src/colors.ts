export const lightColors = {
  background: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1F6',
  text: '#171A21',
  mutedText: '#626A79',
  border: '#DCE1EA',
  primary: '#4F46E5',
  onPrimary: '#FFFFFF',
  success: '#16803A',
  warning: '#A15C00',
  danger: '#C52A32',
  focus: '#818CF8',
} as const;

export type ThemeColors = { [Key in keyof typeof lightColors]: string };

export const darkColors = {
  background: '#0D1017',
  surface: '#171B24',
  surfaceMuted: '#222836',
  text: '#F5F7FB',
  mutedText: '#AAB2C2',
  border: '#303849',
  primary: '#A5B4FC',
  onPrimary: '#171A21',
  success: '#57C878',
  warning: '#F5B84B',
  danger: '#FF7A81',
  focus: '#C7D2FE',
} as const satisfies ThemeColors;
