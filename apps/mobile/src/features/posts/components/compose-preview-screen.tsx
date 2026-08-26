import { Camera, Grip, ImagePlus, X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppScreen } from '../../../components/layout/app-screen';
import { AppButton } from '../../../components/ui/app-button';
import { AppSurface } from '../../../components/ui/app-surface';
import { AppText } from '../../../components/ui/app-text';
import { AppTextField } from '../../../components/ui/app-text-field';
import { useTheme } from '../../../theme/theme-provider';

export function ComposePreviewScreen() {
  const theme = useTheme();

  return (
    <AppScreen isScrollable testID="compose-screen">
      <View style={styles.header}>
        <AppText variant="title" weight="bold">
          Nova publicação
        </AppText>
        <AppText tone="muted" variant="caption">
          2 de 4 fotos
        </AppText>
      </View>
      <View style={styles.mediaRow}>
        {['Treino', 'Evolução'].map((mediaLabel) => (
          <AppSurface key={mediaLabel} style={styles.mediaPreview}>
            <Camera color={theme.colors.primary} size={27} />
            <AppText tone="muted" variant="caption">
              {mediaLabel}
            </AppText>
            <Pressable
              accessibilityLabel={`Remover foto ${mediaLabel}`}
              accessibilityRole="button"
              style={[styles.remove, { backgroundColor: theme.colors.overlay }]}
            >
              <X color={theme.colors.text} size={14} />
            </Pressable>
            <Grip color={theme.colors.muted} size={16} style={styles.grip} />
          </AppSurface>
        ))}
        <AppSurface style={styles.addMedia}>
          <ImagePlus color={theme.colors.muted} size={26} />
        </AppSurface>
      </View>
      <AppText style={styles.helper} tone="muted" variant="caption">
        Segure e arraste para reordenar.
      </AppText>
      <AppTextField
        label="Legenda"
        multiline
        numberOfLines={5}
        placeholder="Compartilhe seu treino, evolução ou conquista..."
        style={styles.captionInput}
        textAlignVertical="top"
      />
      <AppText style={styles.counter} tone="muted" variant="caption">
        0 / 2.200
      </AppText>
      <AppButton label="Publicar" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  addMedia: {
    alignItems: 'center',
    flex: 0.55,
    justifyContent: 'center',
    minHeight: 124,
  },
  captionInput: {
    minHeight: 130,
  },
  counter: {
    paddingBottom: 18,
    paddingTop: 6,
    textAlign: 'right',
  },
  grip: {
    bottom: 7,
    position: 'absolute',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 18,
    paddingTop: 14,
  },
  helper: {
    paddingBottom: 18,
    paddingTop: 7,
  },
  mediaPreview: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    minHeight: 124,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  remove: {
    alignItems: 'center',
    borderRadius: 99,
    height: 26,
    justifyContent: 'center',
    position: 'absolute',
    right: 7,
    top: 7,
    width: 26,
  },
});
