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
          Expo Turbo Starter
        </Text>
        <Text selectable style={{ color: theme.colors.mutedText }}>
          The boring wiring is done. Go build the interesting part.
        </Text>
      </View>

      <Card elevated>
        <Text variant="title">Four packages, one happy Metro</Text>
        <Text selectable style={{ color: theme.colors.mutedText }}>
          This screen lives in the app. The button, theme, and clamp helper all come from shared
          packages.
        </Text>
        <Text selectable variant="label">
          Tiny proof: {count}/10
        </Text>
        <Button label="Add one" onPress={() => setCount((value) => clamp(value + 1, 0, 10))} />
      </Card>

      <FormField hint="Just a UI example. Nothing leaves your device." label="Name your next app">
        <TextInput accessibilityLabel="Name your next app" placeholder="Coffee Run" />
      </FormField>

      <Link asChild href="/about">
        <Pressable style={{ alignSelf: 'flex-start', padding: theme.space.sm }}>
          <Text style={{ color: theme.colors.primary }} variant="label">
            Why this structure?
          </Text>
        </Pressable>
      </Link>
    </Screen>
  );
}
