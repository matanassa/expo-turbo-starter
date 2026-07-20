import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { RootErrorScreen } from '@/screens/root-error';

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <RootErrorScreen {...props} />;
}

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          headerLargeTitle: true,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Starter' }} />
        <Stack.Screen name="about" options={{ headerLargeTitle: false, title: 'Architecture' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
