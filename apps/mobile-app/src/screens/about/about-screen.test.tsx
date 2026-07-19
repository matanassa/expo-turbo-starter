import { render, screen } from '@testing-library/react-native';

import { AboutScreen } from './about-screen';

describe('AboutScreen', () => {
  it('explains each workspace boundary', async () => {
    await render(<AboutScreen />);

    expect(screen.getByText('App')).toBeOnTheScreen();
    expect(screen.getByText('UI')).toBeOnTheScreen();
    expect(screen.getByText('Theme')).toBeOnTheScreen();
    expect(screen.getByText('Utils')).toBeOnTheScreen();
  });
});
