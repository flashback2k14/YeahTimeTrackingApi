import express from 'express';

abstract class AbstractRouter {
  protected router: express.Router;

  constructor() {
    this.router = express.Router();
    this.init();
  }

  abstract init(): void;

  routes(): express.Router {
    return this.router;
  }
}

export default AbstractRouter;
