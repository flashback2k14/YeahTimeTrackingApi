import { PrismaClient, Task } from '@prisma/client';

class HistoryTasksRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, type: string): Promise<Task> {
    return await this.prisma.task.create({
      data: {
        type,
        state: 'Running',
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(userId: string, type: string): Promise<Task> {
    await this.prisma.task.findFirstOrThrow({
      where: {
        userId,
      },
    });

    return await this.prisma.task.update({
      where: {
        type,
        state: 'Running',
      },
      data: {
        state: 'Finished',
      },
    });
  }
}

export default HistoryTasksRepository;
