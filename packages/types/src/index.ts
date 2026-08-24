export type FeedAuthor = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
};

export type FeedPost = {
  id: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  author: FeedAuthor;
};

export type UserPost = {
  id: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
};

export type UserSuggestion = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
};

export type CursorPage<T> = {
  items: T[];
  pageInfo: {
    nextCursor: string | null;
    limit: number;
  };
};

export type UserProfile = {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  postCount: number;
  followersCount: number;
  followingCount: number;
  profile: {
    gym: string | null;
    location: string | null;
    locationUrl: string | null;
    fitnessGoal?: string;
    physicalInfo: {
      weight?: string;
      bodyFat?: string;
      arm?: string;
    } | null;
  };
};
