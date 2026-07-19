import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type CardProps = ComponentProps<typeof View> & {
  elevated?: boolean;
};

export function Card({ elevated = false, style, ...props }: CardProps) {
  const { theme } = useUnistyles();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderCurve: 'continuous',
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          boxShadow: elevated ? theme.shadows.md : theme.shadows.sm,
          gap: theme.space.md,
          padding: theme.space.lg,
        },
        style,
      ]}
      {...props}
    />
  );
}
