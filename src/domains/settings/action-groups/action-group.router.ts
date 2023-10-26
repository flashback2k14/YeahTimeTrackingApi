import type { Request, Response } from 'express';
import { AbstractRouter } from '../../core';
import { getUserId } from '../../../helper';
import ActionGroupRepository from './action-group.repository';

class ActionGroupRouter extends AbstractRouter {
  constructor(private repo: ActionGroupRepository) {
    super();
  }

  init(): void {
    /**
     * @openapi
     *
     * /settings/action-groups:
     *  get:
     *    tags:
     *      - 'Settings - Action group'
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
    this.router.get('/action-groups', async (req: Request, res: Response) => {
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
     * /settings/action-groups:
     *  post:
     *    tags:
     *      - 'Settings - Action group'
     *    security:
     *     - accessHeader: []
     *     - accessBody: []
     *     - accessQuery: []
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/ActionGroupRequest'
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ActionGroupResponse'
     *      '400':
     *        description: Failed response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ApiErrorResponse'
     */
    this.router.post('/action-groups', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const data = await this.repo.create(userId, req.body.name);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    /**
     * @openapi
     *
     * /settings/action-groups/{id}:
     *  put:
     *    tags:
     *      - 'Settings - Action group'
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
     *        description: action group id
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/ActionGroupRequest'
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ActionGroupResponse'
     *      '400':
     *        description: Failed response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ApiErrorResponse'
     */
    this.router.put('/action-groups/:id', async (req: Request, res: Response) => {
      try {
        const userId = getUserId(req);
        const { id } = req.params;
        const data = await this.repo.update(userId, id, req.body.name);
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    /**
     * @openapi
     *
     * /settings/action-groups/{id}:
     *  delete:
     *    tags:
     *      - 'Settings - Action group'
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
     *        description: action group id
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ActionGroupResponse'
     *      '400':
     *        description: Failed response
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/ApiErrorResponse'
     */
    this.router.delete('/action-groups/:id', async (req: Request, res: Response) => {
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
