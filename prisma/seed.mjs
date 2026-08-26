import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USER_COUNT = 100;
const POST_COUNT_PER_USER = 20;
const BATCH_SIZE = 500;
const MINUTE_IN_MILLISECONDS = 60_000;
const seedStartedAt = new Date();
const seedPasswordHash = '$2b$12$iVrQJ3ccjMqwIRKB2I3oeuSSQQOAbi56UYrIAtl7D88DG9fZVYHJq';

const gymDefinitions = [
  { name: 'Academia X', cityId: 2408003 },
  { name: 'Iron Factory', cityId: 2408102 },
  { name: 'Arena Maromba', cityId: 2304400 },
  { name: 'Força Nordeste', cityId: 2611606 },
  { name: 'Estação Fitness', cityId: 2507507 },
  { name: 'Bahia Strong', cityId: 2927408 },
  { name: 'Minas Power', cityId: 3106200 },
  { name: 'Carioca Training Club', cityId: 3304557 },
  { name: 'Sampa Iron House', cityId: 3550308 },
  { name: 'Sul Performance', cityId: 4314902 },
];

const gymImageUrls = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1200&q=80',
];

const avatarImageUrls = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80',
];

const postImageUrls = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1584863231364-2edc166de576?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526401485004-2fda9f6b3776?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80',
];

const firstNames = [
  'Ana',
  'Bruno',
  'Camila',
  'Daniel',
  'Eduarda',
  'Felipe',
  'Gabriela',
  'Henrique',
  'Isabela',
  'João',
  'Karina',
  'Lucas',
  'Mariana',
  'Nicolas',
  'Olívia',
  'Pedro',
  'Rafaela',
  'Samuel',
  'Talita',
  'Vinícius',
];

const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa'];

const bios = [
  'Treino, constância e um passo de cada vez.',
  'Construindo força sem pular etapas.',
  'Musculação, comida de verdade e bom humor.',
  'Em busca da minha melhor versão.',
  'Disciplina nos dias fáceis e nos difíceis.',
  'Registrando a evolução treino após treino.',
  'Mais técnica, mais carga e menos desculpas.',
  'O projeto verão agora dura o ano inteiro.',
  'Treinar bem também é saber descansar.',
  'Frango disciplinado voa mais alto.',
];

const postCaptions = [
  'Treino concluído e endorfina em dia.',
  'Hoje foi dia de superar a carga da semana passada.',
  'Execução primeiro, peso depois. Sempre.',
  'Aquele pump que faz todo o esforço valer a pena.',
  'Começando a semana com treino pesado.',
  'Pequenos avanços também contam como evolução.',
  'Treino de pernas pago com sucesso.',
  'Constância vence a motivação nos dias difíceis.',
  'Mobilidade feita, agora o treino rende de verdade.',
  'Mais uma sessão registrada no projeto.',
  'Sem atalhos: boa técnica e muita paciência.',
  'O treino de hoje foi melhor que o de ontem.',
  'Cardio finalizado sem negociar com a preguiça.',
  'Subindo carga com responsabilidade.',
  'Treino em dupla rende até a última repetição.',
  'Dia de costas e bíceps por aqui.',
  'Agachamento livre e foco total na execução.',
  'Descanso também faz parte do progresso.',
  'Fechando o treino com a sensação de missão cumprida.',
  'Consistência: o verdadeiro pré-treino.',
];

const commentContents = [
  'Treino ficou brabo! Parabéns pela evolução.',
  'Boa! Mantém esse ritmo.',
  'A execução está cada vez melhor.',
  'Inspiração para o treino de hoje.',
  'Esse treino rendeu demais!',
  'Carga subindo e técnica em dia.',
  'Disciplina absurda. Vamos para cima!',
  'Projeto está avançando muito bem.',
  'Mandou muito nessa série.',
  'Consistência que fala, né?',
  'Depois desse post não tem desculpa para faltar.',
  'Excelente progresso. Continua!',
];

const replyContents = [
  'Valeu demais pelo apoio!',
  'Bora evoluir junto!',
  'Tamo junto! O próximo treino já está marcado.',
  'Obrigado! Constância sempre.',
  'É isso! Um treino de cada vez.',
  'A comunidade daqui motiva demais.',
];

function createSeedId(entityCode, counter) {
  return `01929f00-9f98-7c3d-8cf3-${entityCode}${counter.toString(16).padStart(8, '0')}`;
}

function minutesAgo(minuteCount) {
  return new Date(seedStartedAt.getTime() - minuteCount * MINUTE_IN_MILLISECONDS);
}

function createGyms() {
  return gymDefinitions.map((gym, gymIndex) => ({
    id: createSeedId('0001', gymIndex + 1),
    name: gym.name,
    cityId: gym.cityId,
    imageUrl: gymImageUrls[gymIndex],
  }));
}

function createUsersAndProfiles(gyms) {
  const featuredUsers = [
    {
      email: 'extra@onlyfrangos.dev',
      username: 'extrastickersbr',
      name: 'Extra Stickers BR',
      avatarUrl: '/avatars/extrastickersbr.jpg',
      isAdmin: true,
    },
    {
      email: 'fabio@onlyfrangos.dev',
      username: 'fabiocut',
      name: 'Fabio',
      avatarUrl: '/avatars/fabiocut.jpg',
    },
    {
      email: 'coach@onlyfrangos.dev',
      username: 'coachfrango',
      name: 'Coach Frango',
      avatarUrl: avatarImageUrls[2],
    },
  ];

  const users = [];
  const profiles = [];

  for (let userIndex = 0; userIndex < USER_COUNT; userIndex += 1) {
    const featuredUser = featuredUsers[userIndex];
    const generatedName = `${firstNames[userIndex % firstNames.length]} ${
      lastNames[Math.floor(userIndex / firstNames.length)]
    }`;
    const userId = createSeedId('0002', userIndex + 1);
    const gym = gyms[userIndex % gyms.length];
    const username = featuredUser?.username ?? `frango${String(userIndex + 1).padStart(3, '0')}`;

    users.push({
      id: userId,
      email: featuredUser?.email ?? `${username}@onlyfrangos.dev`,
      username,
      passwordHash: seedPasswordHash,
      isAdmin: featuredUser?.isAdmin ?? false,
      createdAt: minutesAgo((USER_COUNT - userIndex) * 24 * 60),
    });

    profiles.push({
      id: createSeedId('0003', userIndex + 1),
      userId,
      name: featuredUser?.name ?? generatedName,
      age: 18 + (userIndex % 33),
      bio: bios[userIndex % bios.length],
      avatarUrl: featuredUser?.avatarUrl ?? avatarImageUrls[userIndex % avatarImageUrls.length],
      gymId: gym.id,
      fitnessGoal: `${60 + (userIndex % 25)} kg → ${66 + (userIndex % 25)} kg`,
      cityId: gym.cityId,
      locationUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.name)}`,
      weight: `${60 + (userIndex % 31)} kg`,
      bodyFat: `${10 + (userIndex % 16)}%`,
      arm: `${30 + (userIndex % 13)} cm`,
      showGym: userIndex % 7 !== 0,
      showCity: userIndex % 5 !== 0,
      showPhysicalInfo: userIndex % 4 !== 0,
    });
  }

  return { users, profiles };
}

function createPostsAndMedia(users) {
  const posts = [];
  const postMedia = [];
  let mediaCounter = 1;

  users.forEach((user, userIndex) => {
    for (let postIndex = 0; postIndex < POST_COUNT_PER_USER; postIndex += 1) {
      const postCounter = userIndex * POST_COUNT_PER_USER + postIndex + 1;
      const postId = createSeedId('0004', postCounter);
      const createdAt = minutesAgo(postIndex * 24 * 60 + userIndex * 7 + 30);
      const primaryImageIndex = (postCounter * 7) % postImageUrls.length;

      posts.push({
        id: postId,
        authorId: user.id,
        caption: postCaptions[(postIndex + userIndex) % postCaptions.length],
        createdAt,
        updatedAt: createdAt,
      });

      postMedia.push({
        id: createSeedId('0005', mediaCounter),
        postId,
        mediaUrl: postImageUrls[primaryImageIndex],
        mediaType: 'IMAGE',
        order: 0,
      });
      mediaCounter += 1;

      if (postIndex % 5 === 0) {
        postMedia.push({
          id: createSeedId('0005', mediaCounter),
          postId,
          mediaUrl: postImageUrls[(primaryImageIndex + 3) % postImageUrls.length],
          mediaType: 'IMAGE',
          order: 1,
        });
        mediaCounter += 1;
      }
    }
  });

  return { posts, postMedia };
}

function createFollows(users) {
  const follows = [];
  const neighborOffsets = [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8];

  users.forEach((user, userIndex) => {
    neighborOffsets.forEach((neighborOffset) => {
      const followingIndex = (userIndex + neighborOffset + users.length) % users.length;
      follows.push({
        id: createSeedId('0006', follows.length + 1),
        followerId: user.id,
        followingId: users[followingIndex].id,
        createdAt: minutesAgo((userIndex + Math.abs(neighborOffset)) * 45 + 10),
      });
    });
  });

  return follows;
}

function createPostInteractions(posts, users) {
  const likes = [];
  const rootComments = [];
  const replies = [];

  posts.forEach((post, postIndex) => {
    const authorIndex = Math.floor(postIndex / POST_COUNT_PER_USER);

    for (let likeOffset = 1; likeOffset <= 8; likeOffset += 1) {
      likes.push({
        id: createSeedId('0007', likes.length + 1),
        userId: users[(authorIndex + likeOffset) % users.length].id,
        postId: post.id,
        createdAt: new Date(post.createdAt.getTime() + likeOffset * MINUTE_IN_MILLISECONDS),
      });
    }

    const commentAuthorOffsets = [9, 17];
    commentAuthorOffsets.forEach((commentAuthorOffset, commentIndex) => {
      const commentAuthorIndex = (authorIndex + commentAuthorOffset) % users.length;
      rootComments.push({
        id: createSeedId('0008', rootComments.length + 1),
        postId: post.id,
        authorId: users[commentAuthorIndex].id,
        content: commentContents[(postIndex + commentIndex) % commentContents.length],
        createdAt: new Date(
          post.createdAt.getTime() + (12 + commentIndex * 7) * MINUTE_IN_MILLISECONDS,
        ),
      });
    });
  });

  rootComments.forEach((parentComment, commentIndex) => {
    const postIndex = Math.floor(commentIndex / 2);
    const postAuthorIndex = Math.floor(postIndex / POST_COUNT_PER_USER);
    replies.push({
      id: createSeedId('0008', rootComments.length + commentIndex + 1),
      postId: parentComment.postId,
      authorId: users[(postAuthorIndex + 25 + (commentIndex % 2)) % users.length].id,
      content: replyContents[commentIndex % replyContents.length],
      parentId: parentComment.id,
      createdAt: new Date(parentComment.createdAt.getTime() + 5 * MINUTE_IN_MILLISECONDS),
    });
  });

  return { likes, rootComments, replies };
}

function createCommentLikes(comments, users) {
  const commentLikes = [];

  comments.forEach((comment) => {
    const authorIndex = users.findIndex((user) => user.id === comment.authorId);

    for (let likeOffset = 1; likeOffset <= 2; likeOffset += 1) {
      commentLikes.push({
        id: createSeedId('0009', commentLikes.length + 1),
        userId: users[(authorIndex + likeOffset) % users.length].id,
        commentId: comment.id,
        createdAt: new Date(comment.createdAt.getTime() + likeOffset * MINUTE_IN_MILLISECONDS),
      });
    }
  });

  return commentLikes;
}

async function createManyInBatches(records, createBatch) {
  for (let batchStart = 0; batchStart < records.length; batchStart += BATCH_SIZE) {
    await createBatch(records.slice(batchStart, batchStart + BATCH_SIZE));
  }
}

async function ensureCitiesExist() {
  const cityIds = gymDefinitions.map((gym) => gym.cityId);
  const cityCount = await prisma.city.count({ where: { codigoIbge: { in: cityIds } } });

  if (cityCount !== cityIds.length) {
    throw new Error(
      'As cidades do seed não foram encontradas. Execute as migrations antes do seed.',
    );
  }
}

async function clearSeededModels() {
  await prisma.$transaction([
    prisma.commentLike.deleteMany(),
    prisma.like.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.postMedia.deleteMany(),
    prisma.post.deleteMany(),
    prisma.follow.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
    prisma.gym.deleteMany(),
  ]);
}

async function main() {
  await ensureCitiesExist();

  const gyms = createGyms();
  const { users, profiles } = createUsersAndProfiles(gyms);
  const { posts, postMedia } = createPostsAndMedia(users);
  const follows = createFollows(users);
  const { likes, rootComments, replies } = createPostInteractions(posts, users);
  const comments = [...rootComments, ...replies];
  const commentLikes = createCommentLikes(comments, users);

  await clearSeededModels();
  await createManyInBatches(gyms, (data) => prisma.gym.createMany({ data }));
  await createManyInBatches(users, (data) => prisma.user.createMany({ data }));
  await createManyInBatches(profiles, (data) => prisma.profile.createMany({ data }));
  await createManyInBatches(posts, (data) => prisma.post.createMany({ data }));
  await createManyInBatches(postMedia, (data) => prisma.postMedia.createMany({ data }));
  await createManyInBatches(follows, (data) => prisma.follow.createMany({ data }));
  await createManyInBatches(likes, (data) => prisma.like.createMany({ data }));
  await createManyInBatches(rootComments, (data) => prisma.comment.createMany({ data }));
  await createManyInBatches(replies, (data) => prisma.comment.createMany({ data }));
  await createManyInBatches(commentLikes, (data) => prisma.commentLike.createMany({ data }));

  console.log('Seed concluído:');
  console.log(`- ${gyms.length} academias`);
  console.log(`- ${users.length} usuários e perfis`);
  console.log(`- ${posts.length} postagens com ${postMedia.length} imagens`);
  console.log(`- ${follows.length} relações de seguidores`);
  console.log(`- ${likes.length} curtidas em postagens`);
  console.log(`- ${comments.length} comentários e respostas`);
  console.log(`- ${commentLikes.length} curtidas em comentários`);
  console.log('Senha de todos os usuários: 123456');
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
