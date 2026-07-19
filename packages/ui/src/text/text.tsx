import type { ComponentProps } from 'react';
import { Text as NativeText } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { TypographyVariant } from '@starter/theme';

export type TextProps = ComponentProps<typeof NativeText> & {
  variant?: TypographyVariant;
};

export function Text({ allowFontScaling = true, style, variant = 'body', ...props }: TextProps) {
  const { theme } = useUnistyles();

  return (
    <NativeText
      allowFontScaling={allowFontScaling}
      style={[{ color: theme.colors.text }, theme.typography[variant], style]}
      {...props}
    />
  );
}
