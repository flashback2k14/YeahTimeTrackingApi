import type { Request, Response } from 'express';
import { AbstractRouter } from '../../core';
import { getUserId } from '../../../helper';
import { TasksService } from '../core';

class ActiveTasksRouter extends AbstractRouter {
  constructor(private service: TasksService) {
    super();
  }

  init(): void {
    this.router.get('/active-tasks', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Tasks \ Active task']
        #swagger.security = [{
          "apiHeader": [],
          "apiBody": [],
          "apiQuery": [],
        }]
      */
      try {
        const userId = getUserId(req);
        const data = await this.service.getAllActiveTasksBy(userId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.post('/active-tasks', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Tasks \ Active task']
        #swagger.security = [{
          "apiHeader": [],
          "apiBody": [],
          "apiQuery": [],
        }]
      */
      try {
        const userId = getUserId(req);
        const data = await this.service.create(userId, req.body.type);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });
  }
}

export default ActiveTasksRouter;
