import type { Request, Response } from 'express';
import { getUserId } from '../../../helper';
import { AbstractRouter } from '../../core';
import ActionRepository from './action.repository';

class ActionRouter extends AbstractRouter {
  constructor(private repo: ActionRepository) {
    super();
  }

  init(): void {
    this.router.get('/actions', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.getAllBy(userId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.post('/actions', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const { name, type, groupId } = req.body;
        const data = await this.repo.create(userId, name, type, groupId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.put('/actions/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const data = await this.repo.update(id, req.body.name, req.body.type);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.delete('/actions/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const data = await this.repo.delete(id);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });
  }
}

export default ActionRouter;
