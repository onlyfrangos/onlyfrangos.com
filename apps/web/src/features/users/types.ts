export type AdminUser = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  name: string;
  age: number | null;
  avatarUrl: string;
  cityId: number | null;
  city: string | null;
  stateId: number | null;
  state: string | null;
};

export type AdminUsersPage = {
  items: AdminUser[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
