import { render, screen } from '@testing-library/react-native';

import { TextInput } from '../text-input';
import { FormField } from './form-field';

describe('FormField', () => {
  it('announces validation feedback', async () => {
    await render(
      <FormField error="Enter a valid email" label="Email address">
        <TextInput accessibilityLabel="Email address" invalid />
      </FormField>
    );

    expect(screen.getByText('Email address')).toBeOnTheScreen();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
  });
});
