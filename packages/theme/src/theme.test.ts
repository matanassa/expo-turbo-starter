import { darkTheme, lightTheme } from './theme';

describe('themes', () => {
  it('keeps light and dark theme contracts aligned', () => {
    expect(Object.keys(darkTheme)).toEqual(Object.keys(lightTheme));
    expect(Object.keys(darkTheme.colors)).toEqual(Object.keys(lightTheme.colors));
    expect(lightTheme.spacing(2)).toBe(16);
  });
});
