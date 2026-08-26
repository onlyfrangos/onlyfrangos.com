import { Bookmark, Heart, MessageCircle, MoreHorizontal, Search, Send } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppScreen } from '../../../components/layout/app-screen';
import { BrandWordmark } from '../../../components/branding/brand-wordmark';
import { AppAvatar } from '../../../components/ui/app-avatar';
import { AppSurface } from '../../../components/ui/app-surface';
import { AppText } from '../../../components/ui/app-text';
import { useTheme } from '../../../theme/theme-provider';

const previewPosts = [
  {
    id: 'preview-1',
    initials: 'MR',
    username: 'maromba_raiz',
    location: 'Fortaleza · CE',
    caption: 'Treino de pernas concluído. Hoje foi dia de superar limites!',
    likes: 128,
    comments: 14,
  },
  {
    id: 'preview-2',
    initials: 'FC',
    username: 'fabiocut',
    location: 'Caucaia · CE',
    caption: 'Constância vence motivação. Mais um treino entregue.',
    likes: 94,
    comments: 8,
  },
] as const;

export function FeedPreviewScreen() {
  const theme = useTheme();

  return (
    <AppScreen isScrollable testID="feed-screen">
      <View style={styles.header}>
        <BrandWordmark compact />
        <Pressable
          accessibilityLabel="Buscar"
          accessibilityRole="button"
          style={[
            styles.iconButton,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Search color={theme.colors.text} size={19} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {previewPosts.map((post) => (
          <AppSurface key={post.id}>
            <View style={styles.authorRow}>
              <AppAvatar
                accessibilityLabel={`Avatar de @${post.username}`}
                initials={post.initials}
              />
              <View style={styles.authorCopy}>
                <AppText weight="bold">@{post.username}</AppText>
                <AppText tone="muted" variant="caption">
                  há 12 min · {post.location}
                </AppText>
              </View>
              <MoreHorizontal color={theme.colors.muted} size={22} />
            </View>

            <View
              accessibilityLabel="Prévia da imagem da publicação"
              accessibilityRole="image"
              style={[styles.media, { backgroundColor: theme.colors.surfaceElevated }]}
            >
              <AppText style={styles.mediaMark} tone="muted" variant="display">
                OF
              </AppText>
              <View style={[styles.counter, { backgroundColor: theme.colors.overlay }]}>
                <AppText variant="caption" weight="bold">
                  1 / 3
                </AppText>
              </View>
            </View>

            <View style={styles.actions}>
              <Heart color={theme.colors.text} size={22} />
              <AppText>{post.likes}</AppText>
              <MessageCircle color={theme.colors.text} size={22} />
              <AppText>{post.comments}</AppText>
              <Send color={theme.colors.text} size={21} />
              <Bookmark color={theme.colors.text} size={21} style={styles.bookmark} />
            </View>
            <AppText style={styles.caption}>
              <AppText weight="bold">@{post.username} </AppText>
              {post.caption}
            </AppText>
          </AppSurface>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  authorCopy: {
    flex: 1,
  },
  authorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  bookmark: {
    marginLeft: 'auto',
  },
  caption: {
    padding: 12,
    paddingTop: 10,
  },
  counter: {
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingTop: 8,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  list: {
    gap: 14,
  },
  media: {
    alignItems: 'center',
    aspectRatio: 1,
    justifyContent: 'center',
  },
  mediaMark: {
    fontSize: 58,
    opacity: 0.25,
  },
});
