import { PrismaClient, User } from '@prisma/client';
import { AES, enc } from 'crypto-js';
import { Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { RequestWithDecoded } from '../domains/auth';
import { AuthUser } from '../domains/auth/auth.repository';
import {
  ActionGroupRepository,
  ActionGroupRouter,
  ActionRepository,
  ActionRouter,
  ActiveTasksRepository,
  ActiveTasksRouter,
  AuthenticationRepository,
  AuthenticationRouter,
  AuthRepository,
  AuthRouter,
  HistoryTasksRepository,
  HistoryTasksRouter,
  TasksService,
} from '../domains';

const pwSecret = process.env.PW_SECRET || 'ksdkvjeuf8rio32vn3oigu4389gji';
const tokenSecret = process.env.TOKEN_SECRET || 'sölfierghjfdgjhjekg';
const tokenExpires = process.env.TOKEN_EXPIRES || '1d';
const tokenIssuer = process.env.TOKEN_ISSUER || 'Dev Issuer';

export interface VerifyTokenResult {
  type: 'SUCCESS' | 'ERROR';
  body: string;
}

export function encrypt(text: string): string {
  return AES.encrypt(text, pwSecret).toString();
}

export function decrypt(text: string): string {
  return AES.decrypt(text.toString(), pwSecret).toString(enc.Utf8);
}

export function createToken(user: AuthUser): string {
  return sign(user, tokenSecret, {
    expiresIn: tokenExpires,
    issuer: tokenIssuer,
  });
}

export function verifyToken(token: string): VerifyTokenResult {
  try {
    const decoded = verify(token, tokenSecret);
    return {
      type: 'SUCCESS',
      body: JSON.stringify(decoded as AuthUser),
    };
  } catch (error: any) {
    let msg = 'Failed to authenticate token.';

    if (error.name === 'TokenExpiredError') {
      msg = `${msg} Token expired at ${error.expiredAt}`;
    }

    if (error.name === 'JsonWebTokenError') {
      msg = `${msg} Error message: ${error.message}`;
    }

    return {
      type: 'ERROR',
      body: msg,
    };
  }
}

export async function verifyApiToken(
  token: string,
  prisma: PrismaClient
): Promise<VerifyTokenResult> {
  try {
    const {
      user: { pwHash, ...foundUser },
    } = await prisma.authentication.findUniqueOrThrow({
      where: {
        apiToken: token,
      },
      include: {
        user: true,
      },
    });

    return {
      type: 'SUCCESS',
      body: JSON.stringify(foundUser as AuthUser),
    };
  } catch (error) {
    return {
      type: 'ERROR',
      body: 'Failed to authenticate api token.',
    };
  }
}

export function getUserId(req: Request): string {
  return (req as RequestWithDecoded).decoded.id;
}

export function createRoutes(prisma: PrismaClient) {
  const authRouter = new AuthRouter(new AuthRepository(prisma));

  const settingAuthenticationRouter = new AuthenticationRouter(
    new AuthenticationRepository(prisma)
  );
  const settingActionGroupsRouter = new ActionGroupRouter(new ActionGroupRepository(prisma));
  const settingActionsRouter = new ActionRouter(new ActionRepository(prisma));

  const activeTasksRepo = new ActiveTasksRepository(prisma);
  const historyTasksRepo = new HistoryTasksRepository(prisma);

  const tasksService = new TasksService(activeTasksRepo, historyTasksRepo);

  const tasksHistoryRouter = new HistoryTasksRouter(historyTasksRepo);
  const tasksActiveRouter = new ActiveTasksRouter(tasksService);

  return {
    authRoutes: authRouter.routes(),
    settingsRoutes: [
      settingAuthenticationRouter.routes(),
      settingActionGroupsRouter.routes(),
      settingActionsRouter.routes(),
    ],
    tasksRoutes: [tasksHistoryRouter.routes(), tasksActiveRouter.routes()],
  };
}
