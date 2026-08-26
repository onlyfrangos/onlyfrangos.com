import { AppShell } from '../../src/components/layout/app-shell';
import {
  FeedComposerLoading,
  FeedPostsLoading,
} from '../../src/features/feed/components/feed-posts-loading';
import {
  ProfileMobileNavigation,
  ProfileSidebar,
} from '../../src/features/profile/components/profile-sidebar';
import { ProfileTopBar } from '../../src/features/profile/components/profile-top-bar';

export default function FeedLoading() {
  return (
    <AppShell
      leftAside={<ProfileSidebar username="usuario" />}
      rightAsideClassName="border-none bg-transparent p-0"
      rightAside={<FeedRightAsideLoading />}
      mobileNavigation={<ProfileMobileNavigation username="usuario" />}
    >
      <ProfileTopBar />
      <FeedComposerLoading />
      <FeedPostsLoading />
    </AppShell>
  );
}

function FeedRightAsideLoading() {
  return (
    <div className="sticky top-6 space-y-3" aria-hidden="true">
      <div className="animate-pulse rounded-2xl border border-of-border bg-of-surface/90 p-4">
        <div className="h-5 w-36 rounded bg-white/10" />
        <div className="mt-5 space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-white/10" />
              <span className="h-3 flex-1 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
