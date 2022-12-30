// https://www.digitalocean.com/community/tutorials/how-to-build-a-rest-api-with-prisma-and-postgresql
// https://github.com/prisma/prisma-examples/blob/latest/typescript/rest-express
// https://www.prisma.io/docs/concepts/components/prisma-schema/relations/one-to-one-relations

import { PrismaClient } from '@prisma/client';
import express from 'express';
import { AuthRepository, AuthRouter } from './auth';

// init external modules
const prisma = new PrismaClient();
const app = express();

// init own modules
const authRouter = new AuthRouter(new AuthRepository(prisma));

// setup express
app.use(express.json());

// setup endpoints
app.use('/auth', authRouter.routes());

// only for testing
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      _count: true,
      actionGroups: true,
      actions: true,
      activeTasks: true,
      authentication: true,
      tasks: true,
    },
  });
  res.json(users);
});

// running server
app.listen(3000, () => console.log('REST API server ready at: http://localhost:3000'));
