import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../theme/theme-provider';
import { AppText } from './app-text';

type AppAvatarProps = {
  accessibilityLabel: string;
  initials: string;
  size?: number;
};

export function AppAvatar({ accessibilityLabel, initials, size = 44 }: AppAvatarProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      style={[
        styles.avatar,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.primary,
          borderRadius: size / 2,
          height: size,
          width: size,
        },
      ]}
    >
      <AppText weight="bold">{initials.slice(0, 2).toUpperCase()}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderWidth: 2,
    justifyContent: 'center',
  },
});
