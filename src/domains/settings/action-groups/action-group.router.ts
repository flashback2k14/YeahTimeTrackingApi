import type { Request, Response } from 'express';
import { AbstractRouter } from '../../core';
import { getUserId } from '../../../helper';
import ActionGroupRepository from './action-group.repository';

class ActionGroupRouter extends AbstractRouter {
  constructor(private repo: ActionGroupRepository) {
    super();
  }

  init(): void {
    this.router.get('/action-groups', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.getAllBy(userId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.post('/action-groups', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.create(userId, req.body.name);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });
  }
}

export default ActionGroupRouter;
