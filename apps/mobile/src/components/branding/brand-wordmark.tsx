import { StyleSheet, View } from 'react-native';

import { AppText } from '../ui/app-text';

type BrandWordmarkProps = {
  compact?: boolean;
};

export function BrandWordmark({ compact = false }: BrandWordmarkProps) {
  return (
    <View accessibilityLabel="OnlyFrangos" accessibilityRole="header" style={styles.wordmark}>
      <AppText style={compact ? styles.compact : undefined} variant="display">
        ONLY
      </AppText>
      <AppText style={compact ? styles.compact : undefined} tone="primary" variant="display">
        FRANGOS
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  compact: {
    fontSize: 26,
    lineHeight: 30,
  },
  wordmark: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
