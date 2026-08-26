import { Dumbbell, MapPin, Settings } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppScreen } from '../../../components/layout/app-screen';
import { AppAvatar } from '../../../components/ui/app-avatar';
import { AppButton } from '../../../components/ui/app-button';
import { AppSurface } from '../../../components/ui/app-surface';
import { AppText } from '../../../components/ui/app-text';
import { useTheme } from '../../../theme/theme-provider';

export function ProfilePreviewScreen() {
  const theme = useTheme();

  return (
    <AppScreen isScrollable testID="profile-screen">
      <View style={styles.topRow}>
        <AppText variant="title" weight="bold">
          @seu_usuario
        </AppText>
        <Pressable accessibilityLabel="Configurações" accessibilityRole="button" hitSlop={8}>
          <Settings color={theme.colors.text} size={22} />
        </Pressable>
      </View>
      <View style={styles.identity}>
        <AppAvatar accessibilityLabel="Seu avatar" initials="EU" size={86} />
        <AppText variant="subtitle" weight="bold">
          Seu nome
        </AppText>
        <AppText style={styles.centered} tone="muted">
          Sua bio, seus treinos e sua evolução.
        </AppText>
      </View>
      <View style={styles.counts}>
        <ProfileCount label="posts" count="42" />
        <ProfileCount label="seguidores" count="1,2 mil" />
        <ProfileCount label="seguindo" count="318" />
      </View>
      <AppButton label="Editar perfil" variant="secondary" />
      <View style={styles.facts}>
        <AppText tone="muted" variant="caption">
          <Dumbbell color={theme.colors.muted} size={14} /> Academia Central
        </AppText>
        <AppText tone="muted" variant="caption">
          <MapPin color={theme.colors.muted} size={14} /> Fortaleza · CE
        </AppText>
      </View>
      <AppText style={styles.sectionTitle} weight="bold">
        PUBLICAÇÕES
      </AppText>
      <View style={styles.grid}>
        {Array.from({ length: 9 }, (_, mediaIndex) => (
          <AppSurface
            key={`profile-preview-${mediaIndex}`}
            accessibilityLabel={`Publicação ${mediaIndex + 1}`}
            accessibilityRole="image"
            style={styles.gridMedia}
          />
        ))}
      </View>
    </AppScreen>
  );
}

function ProfileCount({ count, label }: { count: string; label: string }) {
  return (
    <View style={styles.count}>
      <AppText weight="bold">{count}</AppText>
      <AppText tone="muted" variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
  },
  count: {
    alignItems: 'center',
    flex: 1,
  },
  counts: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  facts: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    paddingVertical: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  gridMedia: {
    aspectRatio: 1,
    flexBasis: '32%',
    flexGrow: 1,
  },
  identity: {
    alignItems: 'center',
    gap: 7,
    paddingBottom: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 4,
    paddingBottom: 10,
    textAlign: 'center',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
});
