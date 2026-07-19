import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { Text } from '../text';

export type FormFieldProps = PropsWithChildren<{
  error?: string;
  hint?: string;
  label: string;
}>;

export function FormField({ children, error, hint, label }: FormFieldProps) {
  const { theme } = useUnistyles();

  return (
    <View style={{ gap: theme.space.sm }}>
      <Text variant="label">{label}</Text>
      {children}
      {error ? (
        <Text
          accessibilityRole="alert"
          selectable
          style={{ color: theme.colors.danger }}
          variant="caption"
        >
          {error}
        </Text>
      ) : hint ? (
        <Text selectable style={{ color: theme.colors.mutedText }} variant="caption">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
