// https://www.digitalocean.com/community/tutorials/how-to-build-a-rest-api-with-prisma-and-postgresql
// https://github.com/prisma/prisma-examples/blob/latest/typescript/rest-express
// https://www.prisma.io/docs/concepts/components/prisma-schema/relations/one-to-one-relations

import { PrismaClient } from '@prisma/client';
import express from 'express';
import { AuthRepository, AuthRouter, checkAuthState } from './domains/auth';
import { SettingRepository, SettingRouter } from './domains/setting';

// init external modules
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

// init own modules
const authRouter = new AuthRouter(new AuthRepository(prisma));
const settingRouter = new SettingRouter(new SettingRepository(prisma));

// setup express
app.use(express.json());

// setup endpoints
app.use('/auth', authRouter.routes());
app.use('/settings', checkAuthState, settingRouter.routes());

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
app.listen(port, () => console.log(`REST API server ready at: http://localhost:${port}`));
