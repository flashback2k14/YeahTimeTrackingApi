import type { Request, Response } from 'express';
import { getUserId } from '../../../helper';
import { AbstractRouter } from '../../core';
import AuthenticationRepository from './authentication.repository';

class AuthenticationRouter extends AbstractRouter {
  constructor(private repo: AuthenticationRepository) {
    super();
  }

  init(): void {
    this.router.get('/authentication', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Settings \ Authentication']
        #swagger.security = [{
          "accessHeader": [],
          "accessBody": [],
          "accessQuery": [],
        }]
      */
      try {
        const userId = getUserId(req);
        const data = await this.repo.getBy(userId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.post('/authentication', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Settings \ Authentication']
        #swagger.security = [{
          "accessHeader": [],
          "accessBody": [],
          "accessQuery": [],
        }]
      */
      try {
        const userId = getUserId(req);
        const data = await this.repo.create(userId, req.body.apiToken);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.put('/authentication', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Settings \ Authentication']
        #swagger.security = [{
          "accessHeader": [],
          "accessBody": [],
          "accessQuery": [],
        }]
      */
      try {
        const userId = getUserId(req);
        const data = await this.repo.update(userId, req.body.apiToken);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.delete('/authentication/:id', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Settings \ Authentication']
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

export default AuthenticationRouter;
