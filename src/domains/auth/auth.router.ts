import type { Request, Response } from 'express';
import { AbstractRouter } from '../core';
import AuthRepository from './auth.repository';

class AuthRouter extends AbstractRouter {
  constructor(private repo: AuthRepository) {
    super();
  }

  init(): void {
    this.router.post('/signin', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Authentication']
        #swagger.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/AuthRequest'
              }
            }
          }
        }
        #swagger.responses[200] = {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/AuthResponse'
              }
            }
          }
        }
        #swagger.responses[400] = {
          description: 'Failed response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/ApiErrorResponse'
              }
            }
          }
        }
      */
      try {
        const data = await this.repo.signIn(req.body.email, req.body.password);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.router.post('/signup', async (req: Request, res: Response) => {
      /*
        #swagger.tags = ['Authentication']
        #swagger.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/AuthRequest'
              }
            }
          }
        }
        #swagger.responses[200] = {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/AuthResponse'
              }
            }
          }
        }
        #swagger.responses[400] = {
          description: 'Failed response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/ApiErrorResponse'
              }
            }
          }
        }
      */
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
