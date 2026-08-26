import { StyleSheet, View } from 'react-native';

import { AppText } from '../ui/app-text';

type ScreenHeaderProps = {
  description?: string;
  eyebrow?: string;
  title: string;
};

export function ScreenHeader({ description, eyebrow, title }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? (
        <AppText tone="primary" variant="caption" weight="bold">
          {eyebrow.toUpperCase()}
        </AppText>
      ) : null}
      <AppText variant="display">{title}</AppText>
      {description ? <AppText tone="muted">{description}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    paddingBottom: 16,
    paddingTop: 12,
  },
});
