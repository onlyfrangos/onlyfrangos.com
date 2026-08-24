import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const seedPasswordHash = "$2b$12$iVrQJ3ccjMqwIRKB2I3oeuSSQQOAbi56UYrIAtl7D88DG9fZVYHJq";

const ids = {
  users: {
    extra: "01929f00-9f98-7c3d-8cf3-b64f3175b001",
    fabio: "01929f00-9f98-7c3d-8cf3-b64f3175b002",
    coach: "01929f00-9f98-7c3d-8cf3-b64f3175b003"
  },
  gyms: {
    gymx: "01929f00-9f98-7c3d-8cf3-b64f3175e001",
    iron: "01929f00-9f98-7c3d-8cf3-b64f3175e002"
  },
  posts: {
    p1: "01929f00-9f98-7c3d-8cf3-b64f3175c001",
    p2: "01929f00-9f98-7c3d-8cf3-b64f3175c002",
    p3: "01929f00-9f98-7c3d-8cf3-b64f3175c003"
  }
};

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postMedia.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.gym.deleteMany();

  await prisma.gym.createMany({
    data: [
      { id: ids.gyms.gymx, name: "Academia X", city: "Mossoro", state: "RN" },
      { id: ids.gyms.iron, name: "Iron Factory", city: "Natal", state: "RN" }
    ]
  });

  await prisma.user.createMany({
    data: [
      {
        id: ids.users.extra,
        email: "extra@onlyfrangos.dev",
        username: "extrastickersbr",
        passwordHash: seedPasswordHash
      },
      {
        id: ids.users.fabio,
        email: "fabio@onlyfrangos.dev",
        username: "fabiocut",
        passwordHash: seedPasswordHash
      },
      {
        id: ids.users.coach,
        email: "coach@onlyfrangos.dev",
        username: "coachfrango",
        passwordHash: seedPasswordHash
      }
    ]
  });

  await prisma.profile.createMany({
    data: [
      {
        id: "01929f00-9f98-7c3d-8cf3-b64f3175f001",
        userId: ids.users.extra,
        name: "Extra Stickers BR",
        bio: "Figurinhas e treino sem drama.",
        avatarUrl: "/avatars/extrastickersbr.jpg",
        gymId: ids.gyms.gymx,
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
        id: "01929f00-9f98-7c3d-8cf3-b64f3175f002",
        userId: ids.users.fabio,
        name: "Fabio",
        bio: "Projeto 80kg em andamento.",
        avatarUrl: "/avatars/fabiocut.jpg",
        gymId: ids.gyms.iron,
        fitnessGoal: "70 kg -> 80 kg",
        showGym: false,
        showLocation: false,
        showPhysicalInfo: false
      },
      {
        id: "01929f00-9f98-7c3d-8cf3-b64f3175f003",
        userId: ids.users.coach,
        name: "Coach Frango",
        bio: "Consistencia acima de tudo.",
        showGym: true,
        showLocation: false,
        showPhysicalInfo: true
      }
    ]
  });

  await prisma.post.createMany({
    data: [
      {
        id: ids.posts.p1,
        authorId: ids.users.extra,
        caption: "Treino finalizado. Semana comecou forte."
      },
      {
        id: ids.posts.p2,
        authorId: ids.users.fabio,
        caption: "Subindo carga com tecnica e paciencia."
      },
      {
        id: ids.posts.p3,
        authorId: ids.users.coach,
        caption: "Frango disciplinado voa mais alto."
      }
    ]
  });

  await prisma.postMedia.createMany({
    data: [
      {
        id: "01929f00-9f98-7c3d-8cf3-b64f3175a001",
        postId: ids.posts.p1,
        mediaUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200",
        mediaType: "IMAGE",
        order: 0
      },
      {
        id: "01929f00-9f98-7c3d-8cf3-b64f3175a002",
        postId: ids.posts.p2,
        mediaUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
        mediaType: "IMAGE",
        order: 0
      },
      {
        id: "01929f00-9f98-7c3d-8cf3-b64f3175a003",
        postId: ids.posts.p3,
        mediaUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=1200",
        mediaType: "IMAGE",
        order: 0
      }
    ]
  });

  await prisma.follow.createMany({
    data: [
      {
        id: "01929f00-9f98-7c3d-8cf3-b64f3175b101",
        followerId: ids.users.fabio,
        followingId: ids.users.extra
      },
      {
        id: "01929f00-9f98-7c3d-8cf3-b64f3175b102",
        followerId: ids.users.coach,
        followingId: ids.users.extra
      }
    ]
  });

  await prisma.like.createMany({
    data: [
      { id: "01929f00-9f98-7c3d-8cf3-b64f3175b201", userId: ids.users.extra, postId: ids.posts.p2 },
      { id: "01929f00-9f98-7c3d-8cf3-b64f3175b202", userId: ids.users.fabio, postId: ids.posts.p1 },
      { id: "01929f00-9f98-7c3d-8cf3-b64f3175b203", userId: ids.users.coach, postId: ids.posts.p1 }
    ]
  });

  await prisma.comment.createMany({
    data: [
      {
        id: "01929f00-9f98-7c3d-8cf3-b64f3175b301",
        postId: ids.posts.p1,
        authorId: ids.users.fabio,
        content: "Boa! Mantem o ritmo."
      },
      {
        id: "01929f00-9f98-7c3d-8cf3-b64f3175b302",
        postId: ids.posts.p2,
        authorId: ids.users.extra,
        content: "Consistencia absurda."
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
