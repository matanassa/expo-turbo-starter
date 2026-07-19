import { Link, Stack } from 'expo-router';

import { Pressable, Screen, Text } from '@starter/ui';

export default function NotFoundRoute() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Text variant="heading">This route does not exist.</Text>
      <Link asChild href="/">
        <Pressable>
          <Text variant="label">Return to the starter</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}
