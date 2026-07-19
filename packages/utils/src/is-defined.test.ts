import { isDefined } from './is-defined';

describe('isDefined', () => {
  it('filters only nullish values', () => {
    expect([0, null, '', undefined, false].filter(isDefined)).toEqual([0, '', false]);
  });
});
