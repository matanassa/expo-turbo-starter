import { useEffect } from 'react';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { Button, Screen, Text } from '@starter/ui';

import { reportError } from '@/observability/error-reporter';

export type RootErrorScreenProps = {
  error: Error;
  retry: () => void;
};

export function RootErrorScreen({ error, retry }: RootErrorScreenProps) {
  const { theme } = useUnistyles();

  useEffect(() => {
    reportError(error, { source: 'root-error-boundary' });
  }, [error]);

  return (
    <Screen contentContainerStyle={{ justifyContent: 'center' }}>
      <View accessibilityRole="alert" style={{ gap: theme.space.sm }}>
        <Text variant="heading">Something went wrong</Text>
        <Text style={{ color: theme.colors.mutedText }}>
          The app hit an unexpected problem. Try again to reload this screen.
        </Text>
      </View>
      <Button label="Try again" onPress={retry} />
    </Screen>
  );
}
