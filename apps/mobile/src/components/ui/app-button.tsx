import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, View } from 'react-native';

import { useTheme } from '../../theme/theme-provider';
import { AppText } from './app-text';

type AppButtonVariant = 'danger' | 'primary' | 'secondary' | 'subtle';

type AppButtonProps = Omit<PressableProps, 'children'> & {
  isLoading?: boolean;
  label: string;
  leftAccessory?: React.ReactNode;
  variant?: AppButtonVariant;
};

export function AppButton({
  disabled,
  isLoading = false,
  label,
  leftAccessory,
  style,
  variant = 'primary',
  ...pressableProps
}: AppButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || isLoading;
  const backgroundColor = resolveBackgroundColor(variant, theme.colors);
  const borderColor = variant === 'secondary' ? theme.colors.border : backgroundColor;
  const textTone = variant === 'danger' ? 'danger' : 'text';

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      style={(pressableState) => {
        const { pressed } = pressableState;

        return [
          styles.button,
          {
            backgroundColor,
            borderColor,
            minHeight: theme.layout.minimumTouchTarget,
            opacity: isDisabled ? 0.5 : pressed ? 0.78 : 1,
          },
          typeof style === 'function' ? style(pressableState) : style,
        ];
      }}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.colors.text} />
      ) : (
        <View style={styles.content}>
          {leftAccessory}
          <AppText tone={textTone} weight="bold">
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

function resolveBackgroundColor(
  variant: AppButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): string {
  if (variant === 'primary') {
    return colors.primary;
  }

  if (variant === 'subtle') {
    return colors.surfaceElevated;
  }

  return 'transparent';
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
});
