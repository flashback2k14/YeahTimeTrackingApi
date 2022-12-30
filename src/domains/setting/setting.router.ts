import type { Request, Response } from 'express';
import express from 'express';
import { getUserId } from '../../helper';
import SettingRepository from './setting.repository';

class SettingRouter {
  private _routes: express.Router;

  constructor(private repo: SettingRepository) {
    this._routes = express.Router();
    this._initAuthentication();
    this._initActionGroups();
    this._initActions();
  }

  routes(): express.Router {
    return this._routes;
  }

  private _initAuthentication(): void {
    this._routes.get('/authentication', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.getAuthentification(userId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this._routes.post('/authentication', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.createAuthentification(userId, req.body.apiToken);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });
  }

  private _initActionGroups(): void {
    this._routes.get('/action-groups', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.getActionGroups(userId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this._routes.post('/action-groups', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.createActionGroup(userId, req.body.name);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });
  }

  private _initActions(): void {
    this._routes.get('/actions', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.getActions(userId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this._routes.post('/actions', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const { name, type, groupId } = req.body;
        const data = await this.repo.createAction(userId, name, type, groupId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });
  }
}

export default SettingRouter;
