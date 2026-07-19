import { useState } from 'react';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { Link } from 'expo-router';

import { Button, Card, FormField, Pressable, Screen, Text, TextInput } from '@starter/ui';
import { clamp } from '@starter/utils';

export function HomeScreen() {
  const { theme } = useUnistyles();
  const [count, setCount] = useState(0);

  return (
    <Screen>
      <View style={{ gap: theme.space.sm }}>
        <Text selectable variant="display">
          Expo Monorepo Starter
        </Text>
        <Text selectable style={{ color: theme.colors.mutedText }}>
          One Expo app, a shared design system, and a clean place for portable utilities.
        </Text>
      </View>

      <Card elevated>
        <Text variant="title">Workspace integration</Text>
        <Text selectable style={{ color: theme.colors.mutedText }}>
          This screen is rendered from the app with components and tokens provided by workspace
          packages.
        </Text>
        <Text selectable variant="label">
          Count: {count}
        </Text>
        <Button
          label="Increment demo count"
          onPress={() => setCount((value) => clamp(value + 1, 0, 10))}
        />
      </Card>

      <FormField hint="This is starter UI only; no data is submitted." label="Email address">
        <TextInput
          accessibilityLabel="Email address"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="name@example.com"
        />
      </FormField>

      <Link asChild href="/about">
        <Pressable style={{ alignSelf: 'flex-start', padding: theme.space.sm }}>
          <Text style={{ color: theme.colors.primary }} variant="label">
            Explore the package boundaries
          </Text>
        </Pressable>
      </Link>
    </Screen>
  );
}
