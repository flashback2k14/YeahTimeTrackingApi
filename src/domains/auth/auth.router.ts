import type { Request, Response } from 'express';
import express from 'express';
import AuthRepository from './auth.repository';

class AuthRouter {
  private _routes;

  constructor(private repo: AuthRepository) {
    this._routes = express.Router();
    this._init();
  }

  routes(): express.Router {
    return this._routes;
  }

  private _init(): void {
    this._routes.post('/signin', async (req: Request, res: Response) => {
      try {
        const data = await this.repo.signIn(req.body.email, req.body.password);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this._routes.post('/signup', async (req: Request, res: Response) => {
      try {
        const data = await this.repo.signUp(req.body.email, req.body.password);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });
  }
}

export default AuthRouter;
