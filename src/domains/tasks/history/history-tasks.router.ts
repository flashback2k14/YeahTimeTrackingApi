import { AbstractRouter } from '../../core';
import HistoryTasksRepository from './history-tasks.repository';

class HistoryTasksRouter extends AbstractRouter {
  constructor(private repo: HistoryTasksRepository) {
    super();
  }

  init(): void {
    // TODO: add routes here
  }
}

export default HistoryTasksRouter;
