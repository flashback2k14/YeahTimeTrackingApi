import type { Request, Response } from 'express';
import { getUserId } from '../../../helper';
import { AbstractRouter } from '../../core';
import ActionRepository from './action.repository';

class ActionRouter extends AbstractRouter {
  constructor(private repo: ActionRepository) {
    super();
  }

  init(): void {
    /**
     * @openapi
     *
     * /settings/actions:
     *  get:
     *    tags:
     *      - 'Settings - Action'
     *    security:
     *     - accessHeader: []
     *     - accessBody: []
     *     - accessQuery: []
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ActionGroupsResponse'
     *      '400':
     *        description: Failed response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ApiErrorResponse'
     */
    this.router.get('/actions', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.getAllBy(userId);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    /**
     * @openapi
     *
     * /settings/actions:
     *  post:
     *    tags:
     *      - 'Settings - Action'
     *    security:
     *     - accessHeader: []
     *     - accessBody: []
     *     - accessQuery: []
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/ActionRequest'
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ActionResponse'
     *      '400':
     *        description: Failed response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ApiErrorResponse'
     */
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

    /**
     * @openapi
     *
     * /settings/actions/{id}:
     *  put:
     *    tags:
     *      - 'Settings - Action'
     *    security:
     *     - accessHeader: []
     *     - accessBody: []
     *     - accessQuery: []
     *    parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: string
     *        required: true
     *        description: action id
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/ActionRequest'
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ActionResponse'
     *      '400':
     *        description: Failed response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ApiErrorResponse'
     */
    this.router.put('/actions/:id', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const { id } = req.params;
        const data = await this.repo.update(userId, id, req.body.name, req.body.type);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    /**
     * @openapi
     *
     * /settings/actions/{id}:
     *  delete:
     *    tags:
     *      - 'Settings - Action'
     *    security:
     *     - accessHeader: []
     *     - accessBody: []
     *     - accessQuery: []
     *    parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: string
     *        required: true
     *        description: action id
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ActionResponse'
     *      '400':
     *        description: Failed response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ApiErrorResponse'
     */
    this.router.delete('/actions/:id', async (req: Request, res: Response) => {
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

export default ActionRouter;
