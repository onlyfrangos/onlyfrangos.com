import { type PropsWithChildren } from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '../../theme/theme-provider';

type AppTextVariant = 'body' | 'caption' | 'display' | 'subtitle' | 'title';
type AppTextTone = 'danger' | 'muted' | 'primary' | 'text';

type AppTextProps = PropsWithChildren<
  TextProps & {
    tone?: AppTextTone;
    variant?: AppTextVariant;
    weight?: 'bold' | 'medium' | 'regular';
  }
>;

export function AppText({
  children,
  style,
  tone = 'text',
  variant = 'body',
  weight = 'regular',
  ...textProps
}: AppTextProps) {
  const theme = useTheme();
  const fontFamily = resolveFontFamily(variant, weight, theme.typography);

  return (
    <Text
      {...textProps}
      style={[
        styles.base,
        {
          color: theme.colors[tone],
          fontFamily,
          fontSize: theme.typography.sizes[variant],
          lineHeight: theme.typography.lineHeights[variant],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function resolveFontFamily(
  variant: AppTextVariant,
  weight: NonNullable<AppTextProps['weight']>,
  typography: ReturnType<typeof useTheme>['typography'],
): string {
  if (variant === 'display') {
    return typography.headingFontFamily;
  }

  if (weight === 'bold') {
    return typography.bodyBoldFontFamily;
  }

  if (weight === 'medium') {
    return typography.bodyMediumFontFamily;
  }

  return typography.bodyFontFamily;
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  } as TextStyle,
});
