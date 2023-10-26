import { PrismaClient } from '@prisma/client';
import type { Response, Request } from 'express';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import type { CorsOptions } from 'cors';
import cors from 'cors';

import SwaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../../public/static/swagger-openapi.json';

import { createCheckApiTokenMiddleware, checkAuthState, checkBasicAuth } from '../domains';
import { createRoutes } from '../helper';

// init external modules
const prisma = new PrismaClient();
const app = express();

// init own modules
const { authRoutes, settingsRoutes, tasksRoutes } = createRoutes(prisma);
const checkApiToken = createCheckApiTokenMiddleware(prisma);

// setup express
app.use(helmet());
app.use(express.json());

if (process.env.FEATURE_RATE_LIMITING === 'true') {
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 60 * 1000,
      max: 20,
      message: 'You have exceeded the 20 requests in 1 hr limit!',
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}

if (process.env.FEATURE_CORS === 'true') {
  const corsOptions = {
    origin: function (origin: string, callback: (err: Error | null, origin?: any) => void) {
      if (process.env.CORS_ORIGIN === origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  } as CorsOptions;

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
}

// setup endpoints
app.use('/auth', authRoutes);
app.use('/settings', checkAuthState, ...settingsRoutes);
app.use('/tasks', checkApiToken, ...tasksRoutes);

// setup swagger
app.use('/api-docs', checkBasicAuth, SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));

// only for testing
if (process.env.NODE_ENV !== 'production') {
  app.get('/users', async (req: Request, res: Response) => {
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
