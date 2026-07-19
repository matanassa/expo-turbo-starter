import { assertNever } from './assert-never';

describe('assertNever', () => {
  it('throws with the unexpected value', () => {
    expect(() => assertNever('unexpected' as never)).toThrow('Unexpected value: unexpected');
  });
});
