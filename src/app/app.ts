import { PrismaClient } from '@prisma/client';
import express from 'express';

import SwaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../../public/static/swagger-openapi.json';

import { createCheckApiTokenMiddleware, checkAuthState, checkBasicAuth } from '../domains';
import { createRoutes } from '../helper';

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
if (process.env.NODE_ENV !== 'production') {
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
}

// returning application
export default app;
