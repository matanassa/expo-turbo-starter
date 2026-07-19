import { fireEvent, render, screen } from '@testing-library/react-native';

import { HomeScreen } from './home-screen';

describe('HomeScreen', () => {
  it('proves the shared app, UI, theme, and utils integration', async () => {
    await render(<HomeScreen />);

    expect(screen.getByText('Expo Monorepo Starter')).toBeOnTheScreen();
    expect(screen.getByText('Count: 0')).toBeOnTheScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Increment demo count' }));

    expect(await screen.findByText('Count: 1')).toBeOnTheScreen();
  });
});
