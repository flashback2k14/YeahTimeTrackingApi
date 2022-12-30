import express from 'express';
import AuthRepository from './auth.repository';

class AuthRouter {
  private _routes;

  constructor(private repo: AuthRepository) {
    this._routes = express.Router();
    this._init();
  }

  private _init(): void {
    this._routes.post('/signin', async (req, res) => {
      try {
        const data = await this.repo.signIn(req.body.username, req.body.password);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this._routes.post('/signup', async (req, res) => {
      try {
        const data = await this.repo.signUp(req.body.username, req.body.password);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });
  }

  routes(): express.Router {
    return this._routes;
  }
}

export default AuthRouter;
