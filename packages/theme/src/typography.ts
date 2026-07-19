export const typography = {
  display: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
  },
  heading: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '400',
  },
  label: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
} as const;

export type TypographyVariant = keyof typeof typography;
