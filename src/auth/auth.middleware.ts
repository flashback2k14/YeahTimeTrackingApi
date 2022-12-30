import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helper';

export async function checkAuthState(req: Request, res: Response, next: NextFunction) {
  // get token from request
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  // check if token is available
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  // verify token
  const result = verifyToken(token);
  if (result.type === 'SUCCESS') {
    next();
  } else {
    return res.status(400).json({ message: result.body });
  }
}
