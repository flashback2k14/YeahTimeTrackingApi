import type { Request, Response } from 'express';
import { AbstractRouter } from '../../core';
import { getUserId } from '../../../helper';
import HistoryTasksRepository from './history-tasks.repository';

class HistoryTasksRouter extends AbstractRouter {
  constructor(private repo: HistoryTasksRepository) {
    super();
  }

  init(): void {
    this.router.get('/history-tasks', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Tasks \ History task']
        #swagger.security = [{
          "apiHeader": [],
          "apiBody": [],
          "apiQuery": [],
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
  }
}

export default HistoryTasksRouter;
