import { ChevronRight, Dumbbell } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '../../../components/layout/app-screen';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { AppSurface } from '../../../components/ui/app-surface';
import { AppText } from '../../../components/ui/app-text';
import { AppTextField } from '../../../components/ui/app-text-field';
import { useTheme } from '../../../theme/theme-provider';

const previewGyms = [
  { id: 'gym-1', name: 'Academia Central', city: 'Fortaleza · CE', members: 83 },
  { id: 'gym-2', name: 'Força Fitness', city: 'Caucaia · CE', members: 47 },
  { id: 'gym-3', name: 'CT Evolução', city: 'Fortaleza · CE', members: 126 },
] as const;

export function GymsPreviewScreen() {
  const theme = useTheme();

  return (
    <AppScreen isScrollable testID="gyms-screen">
      <ScreenHeader
        description="Encontre sua comunidade local."
        eyebrow="Comunidade"
        title="Academias"
      />
      <AppTextField label="Buscar academia" placeholder="Buscar por nome" />
      <View style={styles.filters}>
        <AppSurface style={styles.filter}>
          <AppText tone="muted" variant="caption">
            Estado
          </AppText>
        </AppSurface>
        <AppSurface style={styles.filter}>
          <AppText tone="muted" variant="caption">
            Cidade
          </AppText>
        </AppSurface>
      </View>
      <View style={styles.list}>
        {previewGyms.map((gym) => (
          <AppSurface key={gym.id} style={styles.gymRow}>
            <View style={[styles.gymImage, { backgroundColor: theme.colors.surfaceElevated }]}>
              <Dumbbell color={theme.colors.primary} size={28} />
            </View>
            <View style={styles.gymCopy}>
              <AppText weight="bold">{gym.name}</AppText>
              <AppText tone="muted" variant="caption">
                {gym.city}
              </AppText>
              <AppText tone="muted" variant="caption">
                {gym.members} membros
              </AppText>
            </View>
            <ChevronRight color={theme.colors.muted} size={20} />
          </AppSurface>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  filter: {
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  gymCopy: {
    flex: 1,
    gap: 2,
  },
  gymImage: {
    alignItems: 'center',
    borderRadius: 12,
    height: 72,
    justifyContent: 'center',
    width: 86,
  },
  gymRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    padding: 10,
  },
  list: {
    gap: 10,
  },
});
