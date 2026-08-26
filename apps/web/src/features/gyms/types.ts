export type Gym = {
  id: string;
  name: string;
  cityId: number;
  city: string;
  stateId: number;
  state: string;
  stateName: string;
  imageUrl: string;
  createdAt: string;
};

export type GymPage = {
  items: Gym[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type GymMember = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  fitnessGoal: string | null;
  followerCount: number;
  postCount: number;
  memberSince: string;
};

export type GymMemberSort = 'recent' | 'oldest' | 'followers';

export type GymMembersPage = {
  items: GymMember[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  sort: GymMemberSort;
};
