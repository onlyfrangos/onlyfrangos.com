import { StyleSheet } from 'react-native';

import { AppScreen } from './app-screen';
import { ScreenHeader } from './screen-header';
import { AppSurface } from '../ui/app-surface';
import { AppText } from '../ui/app-text';

type FeaturePlaceholderScreenProps = {
  description: string;
  title: string;
};

export function FeaturePlaceholderScreen({ description, title }: FeaturePlaceholderScreenProps) {
  return (
    <AppScreen>
      <ScreenHeader eyebrow="Fundação mobile" title={title} />
      <AppSurface style={styles.surface}>
        <AppText tone="muted">{description}</AppText>
      </AppSurface>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 18,
  },
});
