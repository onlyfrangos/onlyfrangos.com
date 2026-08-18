export type User = {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  gym?: string;
  fitnessGoal?: string;
  location?: string;
  locationUrl?: string;
  weight?: string;
  bodyFat?: string;
  arm?: string;
  showGym: boolean;
  showLocation: boolean;
  showPhysicalInfo: boolean;
};

export type Post = {
  id: string;
  authorId: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
};

export type Follow = {
  followerId: string;
  followingId: string;
};

export type Like = {
  userId: string;
  postId: string;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type Gym = {
  id: string;
  name: string;
  city: string;
  state: string;
};
