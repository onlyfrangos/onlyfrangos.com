export type ProfileActionMode = 'self' | 'visitor';

export type ProfileSummaryItem = {
  id: string;
  label: string;
  value: string;
};

export type WorkoutFrequency = {
  totalThisMonth: number;
  days: Array<{
    label: string;
    trained: boolean;
  }>;
};

export type GymPreviewMember = {
  id: string;
  avatarUrl: string;
  name: string;
};

export type GymCardData = {
  name: string;
  addressLine1?: string;
  addressLine2?: string;
  memberCountLabel?: string;
  logoUrl?: string;
  members: GymPreviewMember[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type ProfilePostItem = {
  id: string;
  caption: string;
  imageUrl: string;
  imageUrls: string[];
  createdAtLabel: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  hashtags: string[];
};

export type ProfileTabsItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type ProfileViewData = {
  id: string;
  username: string;
  name: string;
  bio?: string;
  joinedLabel?: string;
  avatarUrl: string;
  verified?: boolean;
  gymLabel?: string;
  gymHref?: string;
  cityLabel?: string;
  naturalLabel?: string;
  goalWeightLabel?: string;
  postsCount: string;
  followersCount: string;
  followersCountValue: number;
  followingCount: string;
  actionMode: ProfileActionMode;
  posts: ProfilePostItem[];
  tabs: ProfileTabsItem[];
  workoutFrequency?: WorkoutFrequency;
  gymCard?: GymCardData;
  physicalSummary?: ProfileSummaryItem[];
};
