import type { ComponentProps } from 'react';
import { TextInput as NativeTextInput } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type TextInputProps = ComponentProps<typeof NativeTextInput> & {
  invalid?: boolean;
};

export function TextInput({
  accessibilityHint,
  accessibilityState,
  editable = true,
  invalid = false,
  placeholderTextColor,
  selectionColor,
  style,
  ...props
}: TextInputProps) {
  const { theme } = useUnistyles();

  return (
    <NativeTextInput
      accessibilityState={{
        ...accessibilityState,
        disabled: !editable,
      }}
      accessibilityHint={accessibilityHint ?? (invalid ? 'Invalid entry' : undefined)}
      allowFontScaling
      editable={editable}
      placeholderTextColor={placeholderTextColor ?? theme.colors.mutedText}
      selectionColor={selectionColor ?? theme.colors.primary}
      style={[
        theme.typography.body,
        {
          backgroundColor: theme.colors.surface,
          borderColor: invalid ? theme.colors.danger : theme.colors.border,
          borderCurve: 'continuous',
          borderRadius: theme.radius.md,
          borderWidth: 1,
          color: theme.colors.text,
          minHeight: 48,
          paddingHorizontal: theme.space.md,
          paddingVertical: theme.space.sm,
        },
        style,
      ]}
      {...props}
    />
  );
}
