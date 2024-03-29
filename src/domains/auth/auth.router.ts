import type { Request, Response } from 'express';
import { AbstractRouter } from '../core';
import AuthRepository from './auth.repository';

class AuthRouter extends AbstractRouter {
  constructor(private repo: AuthRepository) {
    super();
  }

  init(): void {
    /**
     * @openapi
     *
     * /auth/signin:
     *  post:
     *    tags:
     *      - Authentication
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/AuthRequest'
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/AuthResponse'
     *      '400':
     *        description: Failed response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ApiErrorResponse'
     */
    this.router.post('/signin', async (req: Request, res: Response) => {
      try {
        const data = await this.repo.signIn(req.body.email, req.body.password);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    /**
     * @openapi
     *
     * /auth/signup:
     *  post:
     *    tags:
     *      - Authentication
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/AuthRequest'
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/AuthResponse'
     *      '400':
     *        description: Failed response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ApiErrorResponse'
     */
    this.router.post('/signup', async (req: Request, res: Response) => {
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
