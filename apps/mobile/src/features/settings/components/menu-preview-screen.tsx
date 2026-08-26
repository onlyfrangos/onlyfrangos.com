import {
  Ban,
  ChevronRight,
  CircleHelp,
  FileText,
  LogOut,
  Shield,
  UserRoundPen,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppScreen } from '../../../components/layout/app-screen';
import { AppAvatar } from '../../../components/ui/app-avatar';
import { AppSurface } from '../../../components/ui/app-surface';
import { AppText } from '../../../components/ui/app-text';
import { useTheme } from '../../../theme/theme-provider';
import { useAuth } from '../../../providers/auth-provider';

const menuEntries = [
  { id: 'edit-profile', label: 'Editar perfil', icon: UserRoundPen },
  { id: 'privacy', label: 'Conta e privacidade', icon: Shield },
  { id: 'blocked', label: 'Usuários bloqueados', icon: Ban },
  { id: 'policies', label: 'Termos e diretrizes', icon: FileText },
  { id: 'support', label: 'Ajuda e suporte', icon: CircleHelp },
] as const;

export function MenuPreviewScreen() {
  const theme = useTheme();
  const { logout, session } = useAuth();
  const username = session?.user.username ?? 'seu_usuario';

  return (
    <AppScreen isScrollable testID="menu-screen">
      <AppText style={styles.title} variant="title" weight="bold">
        Menu
      </AppText>
      <AppSurface style={styles.identity}>
        <AppAvatar accessibilityLabel="Seu avatar" initials={username.slice(0, 2).toUpperCase()} />
        <View style={styles.identityCopy}>
          <AppText weight="bold">@{username}</AppText>
          <AppText tone="muted" variant="caption">
            Ver perfil
          </AppText>
        </View>
        <ChevronRight color={theme.colors.muted} size={20} />
      </AppSurface>

      <AppSurface style={styles.menuList}>
        {menuEntries.map((menuEntry) => {
          const Icon = menuEntry.icon;
          return (
            <View key={menuEntry.id} style={[styles.menuRow, { borderColor: theme.colors.border }]}>
              <Icon color={theme.colors.muted} size={20} />
              <AppText style={styles.menuLabel} weight="medium">
                {menuEntry.label}
              </AppText>
              <ChevronRight color={theme.colors.muted} size={19} />
            </View>
          );
        })}
      </AppSurface>

      <Pressable accessibilityLabel="Sair" accessibilityRole="button" onPress={() => void logout()}>
        <AppSurface style={styles.logout}>
          <LogOut color={theme.colors.danger} size={20} />
          <AppText tone="danger" weight="medium">
            Sair
          </AppText>
        </AppSurface>
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    padding: 12,
  },
  identityCopy: {
    flex: 1,
  },
  logout: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    padding: 14,
  },
  menuLabel: {
    flex: 1,
  },
  menuList: {
    paddingHorizontal: 14,
  },
  menuRow: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    minHeight: 54,
  },
  title: {
    paddingBottom: 16,
    paddingTop: 14,
  },
});
