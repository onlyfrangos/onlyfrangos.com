import { type PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '../../theme/theme-provider';

type AppSurfaceProps = PropsWithChildren<ViewProps>;

export function AppSurface({ children, style, ...viewProps }: AppSurfaceProps) {
  const theme = useTheme();

  return (
    <View
      {...viewProps}
      style={[
        styles.surface,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
