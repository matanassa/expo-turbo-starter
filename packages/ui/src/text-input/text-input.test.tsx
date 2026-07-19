import { render, screen } from '@testing-library/react-native';

import { TextInput } from './text-input';

describe('TextInput', () => {
  it('exposes an invalid state to assistive technology', async () => {
    await render(
      <TextInput accessibilityLabel="Email address" invalid placeholder="name@example.com" />
    );

    const input = screen.getByLabelText('Email address');

    expect(input.props.accessibilityState).toEqual({
      disabled: false,
    });
    expect(input.props.accessibilityHint).toBe('Invalid entry');
  });
});
