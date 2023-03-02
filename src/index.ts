// https://dev.to/moekidev/testing-with-prisma-3eo8
// https://www.prisma.io/docs/guides/testing/unit-testing
// https://rrawat.com/blog/unit-test-express-api

// !!!! https://dev.to/nathan_sheryak/how-to-test-a-typescript-express-api-with-jest-for-dummies-like-me-4epd

// TODO: add components and refs to docs
// https://github.com/davibaltar/swagger-autogen
// https://www.npmjs.com/package/swagger-ui-express

import { PrismaClient } from '@prisma/client';
import express from 'express';

import SwaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../static/swagger-openapi.json';

import { createCheckApiTokenMiddleware, checkAuthState, checkBasicAuth } from './domains';
import { createRoutes } from './helper';

// init external modules
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

// init own modules
const { authRoutes, settingsRoutes, tasksRoutes } = createRoutes(prisma);
const checkApiToken = createCheckApiTokenMiddleware(prisma);

// setup express
app.use(express.json());

// setup endpoints
app.use('/auth', authRoutes);
app.use('/settings', checkAuthState, ...settingsRoutes);
app.use('/tasks', checkApiToken, ...tasksRoutes);

// setup swagger
app.use('/api-docs', checkBasicAuth, SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));

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
