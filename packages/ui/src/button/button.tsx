import { ActivityIndicator } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { Pressable, type PressableProps } from '../pressable';
import { Text } from '../text';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'accessibilityState' | 'children'> & {
  label: string;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const buttonHeights: Record<ButtonSize, number> = {
  sm: 40,
  md: 48,
  lg: 56,
};

export function Button({
  accessibilityLabel,
  disabled = false,
  label,
  loading = false,
  size = 'md',
  style,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const { theme } = useUnistyles();
  const finalDisabled = disabled || loading;
  const isPrimary = variant === 'primary';
  const foregroundColor = isPrimary ? theme.colors.onPrimary : theme.colors.text;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ busy: loading, disabled: finalDisabled }}
      disabled={finalDisabled}
      style={(state) => [
        {
          alignItems: 'center',
          backgroundColor: isPrimary ? theme.colors.primary : theme.colors.surface,
          borderColor: isPrimary ? theme.colors.primary : theme.colors.border,
          borderCurve: 'continuous',
          borderRadius: theme.radius.md,
          borderWidth: 1,
          flexDirection: 'row',
          gap: theme.space.sm,
          height: buttonHeights[size],
          justifyContent: 'center',
          paddingHorizontal: theme.space.md,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={foregroundColor} /> : null}
      <Text style={{ color: foregroundColor }} variant="label">
        {label}
      </Text>
    </Pressable>
  );
}
