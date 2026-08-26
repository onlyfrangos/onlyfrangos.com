import type { CursorPage, FeedPost } from '@onlyfrangos/types';

import { AppShell } from '../../../components/layout/app-shell';
import { sdk } from '../../../lib/sdk';
import { ProfileMobileNavigation, ProfileSidebar } from '../../profile/components/profile-sidebar';
import { ProfileTopBar } from '../../profile/components/profile-top-bar';

import { FeedRightAside } from './feed-right-aside';

import { FeedContent } from './feed-content';

async function loadFeed(): Promise<CursorPage<FeedPost> | null> {
  try {
    return await sdk.getFeed(20);
  } catch (_err) {
    return null;
  }
}

export async function FeedPage() {
  const initialPage = await loadFeed();
  if (!initialPage) {
    return (
      <AppShell leftAside={null} rightAside={null}>
        <article className="rounded-2xl border border-of-border bg-of-surface/90 p-8 text-center text-of-muted">
          Não foi possível carregar o feed. Tente atualizar a página.
        </article>
      </AppShell>
    );
  }

  const viewerUsername = initialPage.items[0]?.author.username ?? 'extrastickersbr';

  return (
    <AppShell
      leftAside={<ProfileSidebar username={viewerUsername} />}
      rightAsideClassName="border-none bg-transparent p-0"
      rightAside={<FeedRightAside />}
      mobileNavigation={<ProfileMobileNavigation username={viewerUsername} />}
      mobileNavItems={[
        { href: '/feed', label: 'Inicio' },
        { href: '/profile', label: 'Perfil' },
        { href: '#', label: 'Explorar' },
        { href: '#', label: 'Alertas' },
      ]}
    >
      <ProfileTopBar />

      <FeedContent posts={initialPage.items} initialNextCursor={initialPage.pageInfo.nextCursor} />
    </AppShell>
  );
}
