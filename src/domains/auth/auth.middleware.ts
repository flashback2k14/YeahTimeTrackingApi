import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { verifyToken, verifyApiToken } from '../../helper';
import { AuthUser } from './auth.repository';

export type RequestWithDecoded = Request & { decoded: AuthUser };

export function checkAuthState(req: Request, res: Response, next: NextFunction) {
  // get token from request
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  // check if token is available
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  // verify token
  const result = verifyToken(token);

  // check result
  if (result.type === 'SUCCESS') {
    (req as RequestWithDecoded).decoded = JSON.parse(result.body) as AuthUser;
    next();
  } else {
    return res.status(400).json({ message: result.body });
  }
}

export function createCheckApiTokenMiddleware(prisma: PrismaClient) {
  return async function checkApiToken(req: Request, res: Response, next: NextFunction) {
    // get token from request
    const token = req.body.apitoken || req.query.apitoken || req.headers['x-api-token'];

    // check if token is available
    if (!token) {
      return res.status(403).json({ message: 'No api token provided.' });
    }

    // verify token
    const result = await verifyApiToken(token, prisma);

    // check result
    if (result.type === 'SUCCESS') {
      (req as RequestWithDecoded).decoded = JSON.parse(result.body) as AuthUser;
      next();
    } else {
      return res.status(400).json({ message: result.body });
    }
  };
}
