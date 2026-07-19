import { useUnistyles } from 'react-native-unistyles';

import { Card, Screen, Text } from '@starter/ui';

const boundaries = [
  ['App', 'Routes, screens, native configuration, and product behavior.'],
  ['UI', 'Reusable React Native components with accessible defaults.'],
  ['Theme', 'Semantic design tokens shared by app and UI.'],
  ['Utils', 'Pure TypeScript with no React Native dependency.'],
] as const;

export function AboutScreen() {
  const { theme } = useUnistyles();

  return (
    <Screen>
      <Text selectable style={{ color: theme.colors.mutedText }}>
        The dependency graph points in one direction. Shared packages never import application
        source, and consumers use package entrypoints instead of deep imports.
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
