import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { darkTheme } from '@starter/theme';

import { Text } from '../text';
import { Card } from './card';

describe('Card', () => {
  it('groups arbitrary content', async () => {
    await render(
      <Card accessibilityLabel="Account summary">
        <Text>Current plan</Text>
      </Card>
    );

    expect(screen.getByLabelText('Account summary')).toBeOnTheScreen();
    expect(screen.getByText('Current plan')).toBeOnTheScreen();
  });

  it('renders against the registered dark theme contract', async () => {
    await render(<Card accessibilityLabel="Dark card" />);

    const style = StyleSheet.flatten(screen.getByLabelText('Dark card').props.style);

    expect(style.backgroundColor).toBe(darkTheme.colors.surface);
    expect(style.borderColor).toBe(darkTheme.colors.border);
  });
});
