import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const data: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    pwHash: 'sdkfklflk',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of data) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
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
