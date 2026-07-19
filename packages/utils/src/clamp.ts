export function clamp(value: number, minimum: number, maximum: number): number {
  if (minimum > maximum) {
    throw new RangeError('minimum must be less than or equal to maximum');
  }

  return Math.min(Math.max(value, minimum), maximum);
}
