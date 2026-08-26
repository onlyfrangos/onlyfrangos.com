import { colors, layout, radii, spacing, typography } from '@onlyfrangos/design-tokens';

export const mobileTheme = {
  colors,
  layout,
  radii,
  spacing,
  typography,
} as const;

export type MobileTheme = typeof mobileTheme;
