import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from './button';

describe('Button', () => {
  it('announces and blocks interaction while loading', async () => {
    const onPress = jest.fn();

    await render(<Button label="Save changes" loading onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Save changes' });
    fireEvent.press(button);

    expect(button.props.accessibilityState).toEqual({ busy: true, disabled: true });
    expect(onPress).not.toHaveBeenCalled();
  });
});
