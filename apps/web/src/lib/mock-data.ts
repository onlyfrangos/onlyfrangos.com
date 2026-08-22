export type FeedPost = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  caption: string;
  imageUrl: string;
  likes: number;
  comments: number;
  createdAtLabel: string;
};

export const mockFeedPosts: FeedPost[] = [
  {
    id: "1",
    username: "extrastickersbr",
    name: "Extra Stickers BR",
    avatarUrl: "/avatars/extrastickersbr.jpg",
    caption: "Kit novo chegou. Projeto 80kg segue vivo.",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200",
    likes: 148,
    comments: 21,
    createdAtLabel: "ha 2 h"
  },
  {
    id: "2",
    username: "maromba.raiz",
    name: "Maromba Raiz",
    avatarUrl: "/avatars/maromba-raiz.jpg",
    caption: "Treino de pernas finalizado. Frango nao foge do leg day.",
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=1200",
    likes: 292,
    comments: 47,
    createdAtLabel: "ha 5 h"
  },
  {
    id: "3",
    username: "fabiocut",
    name: "Fabio Cut",
    avatarUrl: "/avatars/fabiocut.jpg",
    caption: "72kg -> 80kg. Passo pequeno, consistencia gigante.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
    likes: 411,
    comments: 63,
    createdAtLabel: "ha 1 d"
  }
];

export const mockSuggestions = [
  "wheysemdrama",
  "treinoemdupla",
  "coachfrango",
  "gymmossoro"
];

export const mockProfile = {
  username: "extrastickersbr",
  name: "Extra Stickers BR",
  bio: "Figurinhas, treino e evolucao sem drama.",
  postsCount: 42,
  followersCount: "1.2k",
  followingCount: 381,
  goal: "72 kg -> Meta 80 kg",
  gym: "Academia X",
  location: "Mossoro, RN",
  locationUrl: "https://maps.google.com",
  publicStats: {
    weight: "72 kg",
    bodyFat: "18%",
    arm: "36 cm"
  },
  posts: mockFeedPosts
};
