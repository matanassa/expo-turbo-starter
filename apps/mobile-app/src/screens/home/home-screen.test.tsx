import { fireEvent, render, screen } from '@testing-library/react-native';

import { HomeScreen } from './home-screen';

describe('HomeScreen', () => {
  it('proves the shared app, UI, theme, and utils integration', async () => {
    await render(<HomeScreen />);

    expect(screen.getByText('Expo Turbo Starter')).toBeOnTheScreen();
    expect(screen.getByText('Tiny proof: 0/10')).toBeOnTheScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Add one' }));

    expect(await screen.findByText('Tiny proof: 1/10')).toBeOnTheScreen();
  });
});
