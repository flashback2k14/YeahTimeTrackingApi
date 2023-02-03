import { PrismaClient } from '@prisma/client';
import {
  AuthenticationRepository,
  ActionGroupRepository,
  ActionRepository,
  ActiveTasksRepository,
  HistoryTasksRepository,
} from '../src/domains';

const prisma = new PrismaClient();

const authRepo = new AuthenticationRepository(prisma);
const actionGroupRepo = new ActionGroupRepository(prisma);
const actionRepo = new ActionRepository(prisma);
const activeTasksRepo = new ActiveTasksRepository(prisma);
const historyRepo = new HistoryTasksRepository(prisma);

async function main() {
  console.log(`Start seeding...`);

  const user = await prisma.user.create({
    data: {
      name: 'lorem',
      email: 'lorem@ipsum.test',
      pwHash: 'U2FsdGVkX19nDVpXMCrfH8D98SFxrZN2e+3Pk5eliaM=',
    },
  });

  console.log(`Created user with id: ${user.id}`);

  await authRepo.create(user.id, '1234567890');

  const [group1, group2, group3] = await Promise.all(
    [1, 2, 3].map((i: number) => actionGroupRepo.create(user.id, `group #${i}`))
  );

  await Promise.all(
    [1, 2, 3].map((i: number) => actionRepo.create(user.id, `action #${i}`, `type${i}`, group1.id))
  );

  await Promise.all(
    [4, 5].map((i: number) => actionRepo.create(user.id, `action #${i}`, `type${i}`, group2.id))
  );

  await Promise.all(
    [6].map((i: number) => actionRepo.create(user.id, `action #${i}`, `type${i}`, group3.id))
  );

  await Promise.all([1, 2, 3].map((i: number) => activeTasksRepo.create(user.id, `type${i}`)));

  await Promise.all([1, 2, 3, 4, 5, 6].map((i: number) => historyRepo.create(user.id, `type${i}`)));

  await Promise.all([4, 5, 6].map((i: number) => historyRepo.update(user.id, `type${i}`)));

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
