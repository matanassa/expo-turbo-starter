import type { ComponentProps } from 'react';
import { ScrollView } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type ScreenProps = ComponentProps<typeof ScrollView>;

export function Screen({
  contentContainerStyle,
  contentInsetAdjustmentBehavior = 'automatic',
  keyboardShouldPersistTaps = 'handled',
  style,
  ...props
}: ScreenProps) {
  const { theme } = useUnistyles();

  return (
    <ScrollView
      contentContainerStyle={[
        {
          flexGrow: 1,
          gap: theme.space.lg,
          padding: theme.space.lg,
        },
        contentContainerStyle,
      ]}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      style={[{ backgroundColor: theme.colors.background }, style]}
      {...props}
    />
  );
}
