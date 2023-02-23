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
  console.log('Start seeding...');

  const user = await prisma.user.create({
    data: {
      name: 'lorem',
      email: 'lorem@ipsum.test',
      pwHash: 'U2FsdGVkX19nDVpXMCrfH8D98SFxrZN2e+3Pk5eliaM=',
    },
  });

  console.log(`Created user with id: ${user.id}`);

  await authRepo.create(user.id, '1234567890');

  console.log(`Created authentication for user with id: ${user.id}`);

  const group1 = await actionGroupRepo.create(user.id, 'group #1');
  const group2 = await actionGroupRepo.create(user.id, 'group #2');
  const group3 = await actionGroupRepo.create(user.id, 'group #3');

  console.log(`Created action groups for user with id: ${user.id}`);

  await actionRepo.create(user.id, 'action #1', 'type1', group1.id);
  await actionRepo.create(user.id, 'action #2', 'type2', group1.id);
  await actionRepo.create(user.id, 'action #3', 'type3', group1.id);

  await actionRepo.create(user.id, 'action #4', 'type4', group2.id);
  await actionRepo.create(user.id, 'action #5', 'type5', group2.id);

  await actionRepo.create(user.id, 'action #6', 'type6', group3.id);

  console.log(`Created actions for user with id: ${user.id}`);

  await activeTasksRepo.create(user.id, 'type1');
  await activeTasksRepo.create(user.id, 'type2');
  await activeTasksRepo.create(user.id, 'type3');

  console.log(`Created active tasks for user with id: ${user.id}`);

  await historyRepo.create(user.id, 'type1');
  await historyRepo.create(user.id, 'type2');
  await historyRepo.create(user.id, 'type3');
  await historyRepo.create(user.id, 'type4');
  await historyRepo.create(user.id, 'type5');
  await historyRepo.create(user.id, 'type6');

  console.log(`Created history tasks for user with id: ${user.id}`);

  await historyRepo.update(user.id, 'type4');
  await historyRepo.update(user.id, 'type5');
  await historyRepo.update(user.id, 'type6');

  console.log(`Updated history tasks for user with id: ${user.id}`);

  console.log('Seeding finished.');
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
