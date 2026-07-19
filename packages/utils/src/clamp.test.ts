import { clamp } from './clamp';

describe('clamp', () => {
  it('keeps a value inside the inclusive bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it('rejects reversed bounds', () => {
    expect(() => clamp(5, 10, 0)).toThrow(RangeError);
  });
});
