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
      /*
        #swagger.tags = ['Settings \ Action group']
        #swagger.security = [{
          "accessHeader": [],
          "accessBody": [],
          "accessQuery": [],
        }]
      */
      try {
        const userId = getUserId(req);
        const data = await this.repo.getAllBy(userId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.post('/action-groups', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Settings \ Action group']
        #swagger.security = [{
          "accessHeader": [],
          "accessBody": [],
          "accessQuery": [],
        }]
      */
      try {
        const userId = getUserId(req);
        const data = await this.repo.create(userId, req.body.name);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.put('/action-groups/:id', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Settings \ Action group']
        #swagger.security = [{
          "accessHeader": [],
          "accessBody": [],
          "accessQuery": [],
        }]
      */
      try {
        const userId = getUserId(req);
        const { id } = req.params;
        const data = await this.repo.update(userId, id, req.body.name);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.delete('/action-groups/:id', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Settings \ Action group']
        #swagger.security = [{
          "accessHeader": [],
          "accessBody": [],
          "accessQuery": [],
        }]
      */
      try {
        const userId = getUserId(req);
        const { id } = req.params;
        const data = await this.repo.delete(userId, id);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });
  }
}

export default ActionGroupRouter;
