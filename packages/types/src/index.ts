export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'CONFLICT'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_REFRESH_TOKEN'
  | 'NETWORK_ERROR'
  | 'NOT_FOUND'
  | 'POLICY_VERSION_OUTDATED'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'VALIDATION_ERROR';

export type ApiErrorPayload = {
  code: ApiErrorCode;
  details?: unknown;
  message: string;
  status: number;
};

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  age: number;
  cityId: number;
  fullName: string;
  username: string;
} & LoginRequest;

export type MobilePlatform = 'android' | 'ios';

export type MobileDevice = {
  id: string;
  name?: string;
  platform: MobilePlatform;
};

export type PolicyAcceptance = {
  communityGuidelinesVersion: string;
  privacyPolicyVersion: string;
  termsVersion: string;
};

export type AuthPolicies = {
  minimumAge: number;
} & PolicyAcceptance;

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type MobileAuthSession = {
  refreshToken: string;
} & AuthSession;

export type MobileLoginRequest = {
  device: MobileDevice;
} & LoginRequest;

export type MobileRegisterRequest = {
  device: MobileDevice;
  policyAcceptance: PolicyAcceptance;
} & RegisterRequest;

export type SuccessResponse = {
  success: true;
};

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
  isLiked?: boolean;
  canEdit?: boolean;
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

export type PostMedia = {
  id: string;
  url: string;
};

export type PostDetail = {
  id: string;
  authorId: string;
  caption: string;
  imageUrl: string;
  imageUrls: string[];
  media: PostMedia[];
  createdAt: string;
  author?: Pick<FeedAuthor, 'id' | 'username' | 'avatarUrl'>;
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

export type NumberedPage<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type UserProfile = {
  id: string;
  email?: string;
  username: string;
  isAdmin?: boolean;
  name: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  postCount: number;
  followersCount: number;
  followingCount: number;
  profile: {
    age?: number | null;
    gymId?: string | null;
    gym: string | null;
    gymImageUrl?: string | null;
    cityId?: number | null;
    stateId?: number | null;
    city: string | null;
    state?: string | null;
    fitnessGoal?: string | null;
    physicalInfo: {
      weight?: string | null;
      bodyFat?: string | null;
      arm?: string | null;
    } | null;
    showGym?: boolean;
    showCity?: boolean;
    showPhysicalInfo?: boolean;
  };
};

export type UpdateProfileRequest = {
  age: number | null;
  arm?: string;
  bio?: string;
  bodyFat?: string;
  cityId: number | null;
  email: string;
  fitnessGoal?: string;
  gymId?: string | null;
  name: string;
  showCity: boolean;
  showGym: boolean;
  showPhysicalInfo: boolean;
  username: string;
  weight?: string;
};

export type CommentAuthor = {} & FeedAuthor;

export type PostComment = {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  likeCount: number;
  liked: boolean;
  author: CommentAuthor;
  replies: PostComment[];
};

export type CreateCommentRequest = {
  content: string;
  parentId?: string | null;
};

export type LikeStatus = {
  liked: boolean;
};

export type LikeList = {
  count: number;
  items: UserSuggestion[];
} & LikeStatus;

export type FollowStatus = {
  following: boolean;
  followersCount: number;
};

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

export type GymMemberSort = 'followers' | 'oldest' | 'recent';

export type GymMember = {
  bio: string;
  fitnessGoal: string | null;
  followerCount: number;
  postCount: number;
  memberSince: string;
} & UserSuggestion;

export type GymMemberPage = {
  sort: GymMemberSort;
} & NumberedPage<GymMember>;

export type GymFilters = {
  cityId?: number;
  name?: string;
  page?: number;
  stateId?: number;
};

export type State = {
  codigoUf: number;
  nome: string;
  uf: string;
};

export type City = {
  codigoIbge: number;
  codigoUf: number;
  nome: string;
};
