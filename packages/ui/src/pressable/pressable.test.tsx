import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Text } from '../text';
import { Pressable } from './pressable';

describe('Pressable', () => {
  it('does not call onPress while disabled', async () => {
    const onPress = jest.fn();

    await render(
      <Pressable accessibilityLabel="Disabled action" disabled onPress={onPress}>
        <Text>Disabled action</Text>
      </Pressable>
    );

    fireEvent.press(screen.getByLabelText('Disabled action'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('provides visible pressed feedback', async () => {
    await render(
      <Pressable accessibilityLabel="Available action">
        <Text>Available action</Text>
      </Pressable>
    );

    const action = screen.getByLabelText('Available action');
    fireEvent(action, 'responderGrant', {
      currentTarget: {
        measure: (callback: (...values: number[]) => void) => callback(0, 0, 100, 48, 0, 0),
      },
      nativeEvent: {
        pageX: 0,
        pageY: 0,
        timestamp: Date.now(),
      },
      persist: jest.fn(),
    });

    await waitFor(() => {
      expect(StyleSheet.flatten(action.props.style).opacity).toBeLessThan(1);
    });
  });
});
