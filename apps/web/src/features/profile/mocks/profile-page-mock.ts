import type { ProfileViewData } from "../types";

const defaultAvatar = "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=300";

export function createProfilePageMock(username: string): ProfileViewData {
  return {
    id: "mock-profile",
    username,
    name: "Fernando Costa",
    bio: "Disciplina hoje, resultado amanha.",
    joinedLabel: "Frango desde 2019",
    avatarUrl: defaultAvatar,
    verified: true,
    gymLabel: "PowerFit - Vila Olimpia, SP",
    naturalLabel: "Natural",
    goalWeightLabel: "80 kg",
    postsCount: "128",
    followersCount: "3.2K",
    followingCount: "842",
    actionMode: "self",
    tabs: [
      { id: "posts", label: "Publicacoes" },
      { id: "workouts", label: "Treinos", disabled: true },
      { id: "about", label: "Sobre", disabled: true }
    ],
    posts: [
      {
        id: "p1",
        caption: "Costas no ponto!",
        imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=1200",
        createdAtLabel: "Ha 2 horas",
        likeCount: 342,
        commentCount: 23,
        hashtags: ["BackDay"]
      },
      {
        id: "p2",
        caption: "Supino 100kg",
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
        createdAtLabel: "Ha 1 dia",
        likeCount: 275,
        commentCount: 18,
        hashtags: ["Peito"]
      },
      {
        id: "p3",
        caption: "Ombro e triceps",
        imageUrl: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1200",
        createdAtLabel: "Ha 3 dias",
        likeCount: 421,
        commentCount: 31,
        hashtags: ["Treino"]
      }
    ],
    fitnessSummary: [
      {
        id: "weight",
        label: "Peso atual",
        value: "72,4 kg"
      },
      {
        id: "height",
        label: "Altura",
        value: "1,78 m"
      },
      {
        id: "goal",
        label: "Meta de peso",
        value: "80 kg"
      }
    ],
    workoutFrequency: {
      totalThisMonth: 23,
      days: [
        { label: "S", trained: true },
        { label: "T", trained: true },
        { label: "Q", trained: true },
        { label: "Q", trained: true },
        { label: "S", trained: true },
        { label: "S", trained: true },
        { label: "D", trained: false }
      ]
    },
    gymCard: {
      name: "PowerFit - Vila Olimpia",
      addressLine1: "R. OlimpIadas, 205",
      addressLine2: "Vila Olimpia, SP",
      memberCountLabel: "428 frangos treinam aqui",
      logoUrl: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=200",
      members: [
        {
          id: "m1",
          name: "Membro 1",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100"
        },
        {
          id: "m2",
          name: "Membro 2",
          avatarUrl: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=100"
        },
        {
          id: "m3",
          name: "Membro 3",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"
        },
        {
          id: "m4",
          name: "Membro 4",
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100"
        }
      ],
      ctaLabel: "Ver pagina",
      ctaHref: "#"
    }
  };
}
