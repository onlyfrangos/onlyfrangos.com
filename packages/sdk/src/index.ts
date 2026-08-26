import type {
  ApiErrorCode,
  ApiErrorPayload,
  AuthPolicies,
  City,
  CreateCommentRequest,
  CursorPage,
  FeedPost,
  FollowStatus,
  Gym,
  GymFilters,
  GymMemberPage,
  GymMemberSort,
  LikeList,
  LikeStatus,
  MobileAuthSession,
  MobileLoginRequest,
  MobileRegisterRequest,
  NumberedPage,
  PostComment,
  PostDetail,
  State,
  SuccessResponse,
  UpdateProfileRequest,
  UserPost,
  UserProfile,
  UserSuggestion,
} from '@onlyfrangos/types';

export type SdkHttpRequest = {
  body?: BodyInit;
  headers: Record<string, string>;
  method: string;
  url: string;
};

export type SdkHttpResponse = {
  body: unknown;
  headers: Headers;
  status: number;
};

export type SdkTransport = (request: SdkHttpRequest) => Promise<SdkHttpResponse>;

export type SdkAuthentication = {
  getAccessToken(): Promise<string | null> | string | null;
  onSessionExpired?(): Promise<void> | void;
  refreshAccessToken(): Promise<string | null>;
};

export type OnlyFrangosSdkConfig = {
  authentication?: SdkAuthentication;
  baseUrl: string;
  transport?: SdkTransport;
};

type RequestOptions = {
  authenticate?: boolean;
  body?: BodyInit;
  headers?: Record<string, string>;
  method?: string;
  retryAfterRefresh?: boolean;
};

type JsonRequestOptions = {
  body?: unknown;
} & Omit<RequestOptions, 'body'>;

export class OnlyFrangosApiError extends Error implements ApiErrorPayload {
  readonly code: ApiErrorCode;
  readonly details?: unknown;
  readonly status: number;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'OnlyFrangosApiError';
    this.code = payload.code;
    this.details = payload.details;
    this.status = payload.status;
  }
}

export function createFetchTransport(fetchImplementation: typeof fetch = fetch): SdkTransport {
  return async (request) => {
    const response = await fetchImplementation(request.url, {
      body: request.body,
      headers: request.headers,
      method: request.method,
    });
    const responseText = await response.text();
    let body: unknown = null;

    if (responseText) {
      try {
        body = JSON.parse(responseText) as unknown;
      } catch {
        body = responseText;
      }
    }

    return { body, headers: response.headers, status: response.status };
  };
}

export function createOnlyFrangosSdk(config: OnlyFrangosSdkConfig) {
  const baseUrl = config.baseUrl.replace(/\/$/, '');
  const transport = config.transport ?? createFetchTransport();
  let refreshPromise: Promise<string | null> | null = null;

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!config.authentication) {
      return null;
    }

    refreshPromise ??= config.authentication.refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  };

  const request = async <ResponseBody>(
    path: string,
    options: RequestOptions = {},
  ): Promise<ResponseBody> => {
    const authenticate = options.authenticate ?? true;
    const headers = { ...options.headers };

    if (authenticate && config.authentication) {
      const accessToken = await config.authentication.getAccessToken();
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    let response: SdkHttpResponse;
    try {
      response = await transport({
        body: options.body,
        headers,
        method: options.method ?? 'GET',
        url: `${baseUrl}${normalizePath(path)}`,
      });
    } catch (requestError) {
      if (requestError instanceof OnlyFrangosApiError) {
        throw requestError;
      }

      throw new OnlyFrangosApiError({
        code: 'NETWORK_ERROR',
        details: requestError,
        message: 'Não foi possível conectar à API',
        status: 0,
      });
    }

    if (
      response.status === 401 &&
      authenticate &&
      config.authentication &&
      options.retryAfterRefresh !== false
    ) {
      const accessToken = await refreshAccessToken();
      if (accessToken) {
        return request<ResponseBody>(path, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
          retryAfterRefresh: false,
        });
      }

      await config.authentication.onSessionExpired?.();
    }

    if (response.status < 200 || response.status >= 300) {
      throw createApiError(response.status, response.body);
    }

    return response.body as ResponseBody;
  };

  const requestJson = <ResponseBody>(
    path: string,
    options: JsonRequestOptions = {},
  ): Promise<ResponseBody> =>
    request<ResponseBody>(path, {
      ...options,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      headers: {
        ...(options.body === undefined ? {} : { 'content-type': 'application/json' }),
        ...options.headers,
      },
    });

  return {
    getPolicies() {
      return request<AuthPolicies>('/auth/policies', { authenticate: false });
    },
    mobileLogin(loginRequest: MobileLoginRequest) {
      return requestJson<MobileAuthSession>('/auth/mobile/login', {
        authenticate: false,
        body: loginRequest,
        method: 'POST',
      });
    },
    mobileRegister(registerRequest: MobileRegisterRequest) {
      return requestJson<MobileAuthSession>('/auth/mobile/register', {
        authenticate: false,
        body: registerRequest,
        method: 'POST',
      });
    },
    mobileRefresh(refreshToken: string) {
      return requestJson<MobileAuthSession>('/auth/mobile/refresh', {
        authenticate: false,
        body: { refreshToken },
        method: 'POST',
      });
    },
    mobileLogout(refreshToken: string) {
      return requestJson<SuccessResponse>('/auth/mobile/logout', {
        authenticate: false,
        body: { refreshToken },
        method: 'POST',
      });
    },
    getFeed(limit = 20, cursor?: string) {
      return request<CursorPage<FeedPost>>(`/feed?${createQuery({ cursor, limit })}`);
    },
    getMe() {
      return request<UserProfile>('/users/me');
    },
    updateMe(profile: UpdateProfileRequest) {
      return requestJson<UserProfile>('/users/me', { body: profile, method: 'PATCH' });
    },
    getUserByUsername(username: string) {
      return request<UserProfile>(`/users/${encodeURIComponent(username)}`);
    },
    getUserSuggestions(limit = 5) {
      return request<UserSuggestion[]>(`/users/suggestions?${createQuery({ limit })}`);
    },
    getMyUserSuggestions(limit = 5) {
      return request<UserSuggestion[]>(`/users/me/suggestions?${createQuery({ limit })}`);
    },
    getUserPosts(username: string) {
      return request<UserPost[]>(`/users/${encodeURIComponent(username)}/posts`);
    },
    getPost(postId: string) {
      return request<PostDetail>(`/posts/${encodeURIComponent(postId)}`);
    },
    createPost(formData: FormData) {
      return request<PostDetail>('/posts', { body: formData, method: 'POST' });
    },
    updatePost(postId: string, formData: FormData) {
      return request<PostDetail>(`/posts/${encodeURIComponent(postId)}`, {
        body: formData,
        method: 'PATCH',
      });
    },
    deletePost(postId: string) {
      return request<SuccessResponse>(`/posts/${encodeURIComponent(postId)}`, {
        method: 'DELETE',
      });
    },
    getPostLikes(postId: string) {
      return request<LikeList>(`/posts/${encodeURIComponent(postId)}/likes`);
    },
    likePost(postId: string) {
      return request<LikeStatus>(`/posts/${encodeURIComponent(postId)}/likes`, {
        method: 'POST',
      });
    },
    unlikePost(postId: string) {
      return request<LikeStatus>(`/posts/${encodeURIComponent(postId)}/likes`, {
        method: 'DELETE',
      });
    },
    getComments(postId: string) {
      return request<PostComment[]>(`/posts/${encodeURIComponent(postId)}/comments`);
    },
    createComment(postId: string, comment: CreateCommentRequest) {
      return requestJson<PostComment>(`/posts/${encodeURIComponent(postId)}/comments`, {
        body: comment,
        method: 'POST',
      });
    },
    deleteComment(postId: string, commentId: string) {
      return request<SuccessResponse>(
        `/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`,
        { method: 'DELETE' },
      );
    },
    likeComment(postId: string, commentId: string) {
      return request<LikeStatus>(
        `/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}/likes`,
        { method: 'POST' },
      );
    },
    unlikeComment(postId: string, commentId: string) {
      return request<LikeStatus>(
        `/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}/likes`,
        { method: 'DELETE' },
      );
    },
    getFollowStatus(userId: string) {
      return request<FollowStatus>(`/users/${encodeURIComponent(userId)}/follow`);
    },
    followUser(userId: string) {
      return request<FollowStatus>(`/users/${encodeURIComponent(userId)}/follow`, {
        method: 'POST',
      });
    },
    unfollowUser(userId: string) {
      return request<FollowStatus>(`/users/${encodeURIComponent(userId)}/follow`, {
        method: 'DELETE',
      });
    },
    getGyms(filters: GymFilters = {}) {
      return request<NumberedPage<Gym>>(
        `/gyms?${createQuery({
          cityId: filters.cityId,
          name: filters.name,
          page: filters.page,
          stateId: filters.stateId,
        })}`,
      );
    },
    getGym(gymId: string) {
      return request<Gym>(`/gyms/${encodeURIComponent(gymId)}`);
    },
    getGymMembers(gymId: string, page = 1, sort: GymMemberSort = 'recent') {
      return request<GymMemberPage>(
        `/gyms/${encodeURIComponent(gymId)}/members?${createQuery({ page, sort })}`,
      );
    },
    getStates() {
      return request<State[]>('/locations/states', { authenticate: false });
    },
    getCities(stateId?: number) {
      const query = createQuery({ stateId });
      return request<City[]>(`/locations/cities${query ? `?${query}` : ''}`, {
        authenticate: false,
      });
    },
  };
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function createQuery(values: Record<string, number | string | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  }
  return query.toString();
}

function createApiError(status: number, responseBody: unknown): OnlyFrangosApiError {
  const parsedBody = isRecord(responseBody) ? responseBody : {};
  const nestedError = isRecord(parsedBody.error) ? parsedBody.error : {};
  const rawMessage = parsedBody.message ?? nestedError.message;
  const message = Array.isArray(rawMessage)
    ? rawMessage.filter((entry): entry is string => typeof entry === 'string').join(', ')
    : typeof rawMessage === 'string'
      ? rawMessage
      : defaultErrorMessage(status);
  const rawCode = parsedBody.code ?? nestedError.code;
  const code = isApiErrorCode(rawCode) ? rawCode : statusToErrorCode(status);

  return new OnlyFrangosApiError({
    code,
    details: parsedBody.details ?? nestedError.details,
    message,
    status,
  });
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null;
}

function isApiErrorCode(input: unknown): input is ApiErrorCode {
  return (
    typeof input === 'string' &&
    [
      'BAD_REQUEST',
      'CONFLICT',
      'FORBIDDEN',
      'INTERNAL_ERROR',
      'INVALID_CREDENTIALS',
      'INVALID_REFRESH_TOKEN',
      'NETWORK_ERROR',
      'NOT_FOUND',
      'POLICY_VERSION_OUTDATED',
      'RATE_LIMITED',
      'UNAUTHORIZED',
      'VALIDATION_ERROR',
    ].includes(input)
  );
}

function statusToErrorCode(status: number): ApiErrorCode {
  if (status === 400 || status === 422) {
    return 'VALIDATION_ERROR';
  }
  if (status === 401) {
    return 'UNAUTHORIZED';
  }
  if (status === 403) {
    return 'FORBIDDEN';
  }
  if (status === 404) {
    return 'NOT_FOUND';
  }
  if (status === 409) {
    return 'CONFLICT';
  }
  if (status === 429) {
    return 'RATE_LIMITED';
  }
  return 'INTERNAL_ERROR';
}

function defaultErrorMessage(status: number): string {
  if (status === 401) {
    return 'Sua sessão expirou';
  }
  if (status >= 500) {
    return 'A API encontrou um erro inesperado';
  }
  return 'A solicitação não pôde ser concluída';
}
