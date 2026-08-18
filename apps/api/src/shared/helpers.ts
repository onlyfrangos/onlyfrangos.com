import type { Post, User } from "./models";

export function findUserByUsername(users: User[], username: string) {
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase());
}

export function sortPostsChronologically(items: Post[]) {
  return [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
