import { render, screen } from '@testing-library/react-native';

import { Text } from './text';

describe('Text', () => {
  it('renders selectable, scalable content with a typography variant', async () => {
    await render(
      <Text selectable variant="heading">
        Shared UI
      </Text>
    );

    const text = screen.getByText('Shared UI');

    expect(text.props.allowFontScaling).toBe(true);
    expect(text.props.selectable).toBe(true);
  });
});
