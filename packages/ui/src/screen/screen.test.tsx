import { render, screen } from '@testing-library/react-native';

import { Text } from '../text';
import { Screen } from './screen';

describe('Screen', () => {
  it('uses automatic content insets for responsive routes', async () => {
    await render(
      <Screen testID="screen">
        <Text>Responsive content</Text>
      </Screen>
    );

    expect(screen.getByTestId('screen').props.contentInsetAdjustmentBehavior).toBe('automatic');
    expect(screen.getByText('Responsive content')).toBeOnTheScreen();
  });
});
