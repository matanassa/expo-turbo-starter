import { useUnistyles } from 'react-native-unistyles';

import { Card, Screen, Text } from '@starter/ui';

const boundaries = [
  ['App', 'Where your product gets opinionated: routes, screens, native config, and behavior.'],
  ['UI', 'Buttons, cards, and fields with accessible defaults—ready to evolve with your app.'],
  [
    'Theme',
    'The small set of semantic tokens that keeps light and dark mode speaking the same language.',
  ],
  ['Utils', 'Plain TypeScript helpers that can run anywhere, without dragging React Native along.'],
] as const;

export function AboutScreen() {
  const { theme } = useUnistyles();

  return (
    <Screen>
      <Text selectable style={{ color: theme.colors.mutedText }}>
        A few rules keep this repo boring in the best way: packages have one job, dependencies point
        toward the app, and public entrypoints are the only way in.
      </Text>

      {boundaries.map(([title, description]) => (
        <Card key={title}>
          <Text variant="title">{title}</Text>
          <Text selectable style={{ color: theme.colors.mutedText }}>
            {description}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
