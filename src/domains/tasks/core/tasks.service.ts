import { ActiveTask } from '@prisma/client';
import { ActiveTasksRepository } from '../active';
import { HistoryTasksRepository } from '../history';

class TasksService {
  constructor(
    private activeTasksRepo: ActiveTasksRepository,
    private historyTasksRepo: HistoryTasksRepository
  ) {}

  async getAllActiveTasksBy(userId: string): Promise<ActiveTask[]> {
    return await this.activeTasksRepo.getAllBy(userId);
  }

  /**
   * check active table if task type is inside
   *  no?
   *    --> add to active tasks table
   *    --> add to history table and set state to running
   *  yes?
   *    --> remove from active tasks table
   *    --> update history tabke entry to finished state
   */
  async create(userId: string, type: string): Promise<ActiveTask> {
    const foundActiveTasks = await this.activeTasksRepo.getAllByType(userId, type);

    if ((foundActiveTasks?.length ?? 0) === 0) {
      await this.historyTasksRepo.create(userId, type);
      return await this.activeTasksRepo.create(userId, type);
    } else {
      await this.historyTasksRepo.update(userId, type);
      return await this.activeTasksRepo.delete(userId, foundActiveTasks[0].id);
    }
  }
}

export default TasksService;
