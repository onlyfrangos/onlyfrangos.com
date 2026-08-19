import type { CursorPage, FeedPost, UserPost, UserProfile } from "@onlyfrangos/types";

type SdkConfig = {
  baseUrl: string;
};

export function createOnlyFrangosSdk(config: SdkConfig) {
  const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(`${config.baseUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        ...(init?.headers ?? {})
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  };

  return {
    getFeed(limit = 20, cursor?: string) {
      const query = new URLSearchParams({ limit: String(limit) });
      if (cursor) {
        query.set("cursor", cursor);
      }
      return request<CursorPage<FeedPost>>(`/feed?${query.toString()}`);
    },
    getUserByUsername(username: string) {
      return request<UserProfile>(`/users/${username}`);
    },
    getUserPosts(username: string) {
      return request<UserPost[]>(`/users/${username}/posts`);
    }
  };
}
