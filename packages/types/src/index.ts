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
  imageUrls: string[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
  author: FeedAuthor;
};

export type UserPost = {
  id: string;
  caption: string;
  imageUrl: string;
  imageUrls: string[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
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
  createdAt: string;
  postCount: number;
  followersCount: number;
  followingCount: number;
  profile: {
    gymId?: string | null;
    gym: string | null;
    gymImageUrl?: string | null;
    city: string | null;
    fitnessGoal?: string | null;
    physicalInfo: {
      weight?: string | null;
      bodyFat?: string | null;
      arm?: string | null;
    } | null;
  };
};
