const localAvatars: Record<string, string> = {
  extrastickersbr: '/avatars/extrastickersbr.jpg',
  fabiocut: '/avatars/fabiocut.jpg',
  'maromba.raiz': '/avatars/maromba-raiz.jpg',
};

const defaultAvatarUrl = '/branding/onlyfrangos-logo.png';

export function resolveAvatarUrl(avatarUrl: string | null | undefined, username: string): string {
  return avatarUrl?.trim() || localAvatars[username] || defaultAvatarUrl;
}
