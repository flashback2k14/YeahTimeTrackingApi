import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
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

export function checkBasicAuth(req: Request, res: Response, next: NextFunction) {
  function _getUserFromHeader(headers: IncomingHttpHeaders) {
    const authHeader = headers['authorization'] ?? '';
    const base64UserCred = authHeader.split(' ')[1];
    const userCred = Buffer.from(base64UserCred, 'base64').toString();
    const username = userCred.split(':')[0];
    const pw = userCred.split(':')[1];
    return { username, pw };
  }

  function _getAllowedUsers() {
    const splittedUsers = process.env.DOC_USERS?.split(' ') ?? [];
    return splittedUsers
      .map((user: string) => user.split(':'))
      .map((splits: string[]) => ({ username: splits[0], pw: splits[1] }));
  }

  if (!('authorization' in req.headers)) {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required. Authorization header is missing.');
    return;
  }

  const requestedUser = _getUserFromHeader(req.headers);
  const allowedUsers = _getAllowedUsers();

  const foundAllowedUser = allowedUsers.find(
    (allowedUser) => allowedUser.username === requestedUser.username
  );

  if (!foundAllowedUser) {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required. Wrong username / password.');
    return;
  }

  if (requestedUser.pw !== foundAllowedUser.pw) {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required. Password mismatch.');
    return;
  }

  return next();
}
