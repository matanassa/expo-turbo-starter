import type { ComponentProps } from 'react';
import { Pressable as NativePressable } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type PressableProps = ComponentProps<typeof NativePressable>;

export function Pressable({
  accessibilityRole = 'button',
  disabled = false,
  style,
  ...props
}: PressableProps) {
  const { theme } = useUnistyles();

  return (
    <NativePressable
      accessibilityRole={accessibilityRole}
      disabled={disabled}
      style={(state) => [
        {
          opacity: disabled ? 0.5 : state.pressed ? 0.72 : 1,
          borderCurve: 'continuous',
        },
        state.pressed && !disabled ? { backgroundColor: theme.colors.surfaceMuted } : undefined,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    />
  );
}
