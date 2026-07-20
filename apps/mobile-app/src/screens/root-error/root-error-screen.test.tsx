import { fireEvent, render, screen } from '@testing-library/react-native';

import { configureErrorReporter } from '@/observability/error-reporter';

import { RootErrorScreen } from './root-error-screen';

describe('RootErrorScreen', () => {
  it('offers a safe recovery path without exposing the underlying error', async () => {
    const retry = jest.fn();

    await render(<RootErrorScreen error={new Error('secret request payload')} retry={retry} />);

    expect(screen.getByText('Something went wrong')).toBeOnTheScreen();
    expect(screen.queryByText('secret request payload')).not.toBeOnTheScreen();

    fireEvent.press(screen.getByRole('button', { name: 'Try again' }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('reports the root failure through the app-owned observability seam', async () => {
    const reporter = jest.fn();
    const restoreReporter = configureErrorReporter(reporter);

    try {
      const error = new Error('render failed');

      await render(<RootErrorScreen error={error} retry={jest.fn()} />);

      expect(reporter).toHaveBeenCalledWith(error, { source: 'root-error-boundary' });
    } finally {
      restoreReporter();
    }
  });

  it('keeps the recovery screen usable when the configured reporter fails', async () => {
    const restoreReporter = configureErrorReporter(() => {
      throw new Error('reporting unavailable');
    });

    try {
      await render(<RootErrorScreen error={new Error('render failed')} retry={jest.fn()} />);

      expect(screen.getByRole('button', { name: 'Try again' })).toBeOnTheScreen();
    } finally {
      restoreReporter();
    }
  });
});
