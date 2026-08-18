import type { Comment, Follow, Gym, Like, Post, User } from "./models";

export const users: User[] = [
  {
    id: "01929f00-9f98-7c3d-8cf3-b64f3175b001",
    username: "extrastickersbr",
    name: "Extra Stickers BR",
    bio: "Figurinhas e treino todo dia.",
    avatarUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200",
    gym: "Academia X",
    fitnessGoal: "72 kg -> 80 kg",
    location: "Mossoro, RN",
    locationUrl: "https://maps.google.com",
    weight: "72 kg",
    bodyFat: "18%",
    arm: "36 cm",
    showGym: true,
    showLocation: true,
    showPhysicalInfo: true
  },
  {
    id: "01929f00-9f98-7c3d-8cf3-b64f3175b002",
    username: "fabiocut",
    name: "Fabio Cut",
    bio: "Projeto 80kg sem drama.",
    avatarUrl: "https://images.unsplash.com/photo-1584863231364-2edc166de576?q=80&w=200",
    showGym: false,
    showLocation: false,
    showPhysicalInfo: false
  }
];

export const posts: Post[] = [
  {
    id: "01929f00-9f98-7c3d-8cf3-b64f3175c001",
    authorId: users[0].id,
    caption: "Novo treino de perna finalizado.",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: "01929f00-9f98-7c3d-8cf3-b64f3175c002",
    authorId: users[1].id,
    caption: "Consistencia vence motivacao.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  }
];

export const follows: Follow[] = [
  { followerId: users[1].id, followingId: users[0].id }
];

export const likes: Like[] = [
  { userId: users[0].id, postId: posts[1].id },
  { userId: users[1].id, postId: posts[0].id }
];

export const comments: Comment[] = [
  {
    id: "01929f00-9f98-7c3d-8cf3-b64f3175d001",
    postId: posts[0].id,
    userId: users[1].id,
    content: "Brabissimo, segue firme.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  }
];

export const gyms: Gym[] = [
  { id: "01929f00-9f98-7c3d-8cf3-b64f3175e001", name: "Academia X", city: "Mossoro", state: "RN" },
  { id: "01929f00-9f98-7c3d-8cf3-b64f3175e002", name: "Iron Factory", city: "Natal", state: "RN" }
];
