export const colors = {
  background: '#0B0B0F',
  surface: '#15151B',
  surfaceElevated: '#1C1C23',
  primary: '#E80000',
  primaryPressed: '#C90000',
  text: '#FCFAF4',
  muted: '#A7A7B0',
  border: '#292930',
  danger: '#FF6B6B',
  success: '#48C78E',
  overlay: 'rgba(0, 0, 0, 0.72)',
} as const;

export const spacing = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
} as const;

export const typography = {
  bodyFontFamily: 'Manrope_400Regular',
  bodyMediumFontFamily: 'Manrope_600SemiBold',
  bodyBoldFontFamily: 'Manrope_700Bold',
  headingFontFamily: 'BebasNeue_400Regular',
  sizes: {
    caption: 12,
    body: 14,
    subtitle: 16,
    title: 22,
    display: 32,
  },
  lineHeights: {
    caption: 16,
    body: 21,
    subtitle: 24,
    title: 28,
    display: 36,
  },
} as const;

export const layout = {
  minimumTouchTarget: 44,
  screenHorizontalPadding: spacing.md,
  contentMaximumWidth: 680,
  tabBarHeight: 72,
} as const;
