import { AlertCircle, CloudOff, Inbox, LoaderCircle } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '../../theme/theme-provider';
import { AppButton } from './app-button';
import { AppText } from './app-text';

type ScreenStateVariant = 'empty' | 'error' | 'loading' | 'offline';

type ScreenStateProps = {
  actionLabel?: string;
  description: string;
  onAction?: () => void;
  title: string;
  variant: ScreenStateVariant;
};

export function ScreenState({
  actionLabel,
  description,
  onAction,
  title,
  variant,
}: ScreenStateProps) {
  const theme = useTheme();
  const iconColor = variant === 'error' ? theme.colors.danger : theme.colors.muted;
  const Icon = resolveStateIcon(variant);

  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      {variant === 'loading' ? (
        <ActivityIndicator color={theme.colors.primary} size="large" />
      ) : (
        <Icon color={iconColor} size={36} />
      )}
      <AppText style={styles.centeredText} variant="subtitle" weight="bold">
        {title}
      </AppText>
      <AppText style={styles.centeredText} tone="muted">
        {description}
      </AppText>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}

function resolveStateIcon(variant: ScreenStateVariant) {
  if (variant === 'error') {
    return AlertCircle;
  }

  if (variant === 'offline') {
    return CloudOff;
  }

  if (variant === 'loading') {
    return LoaderCircle;
  }

  return Inbox;
}

const styles = StyleSheet.create({
  centeredText: {
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    padding: 32,
  },
});
