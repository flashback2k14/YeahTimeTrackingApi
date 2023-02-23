import { ActiveTask, PrismaClient } from '@prisma/client';

class ActiveTasksRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllBy(userId: string): Promise<ActiveTask[]> {
    return await this.prisma.activeTask.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async getAllByType(userId: string, type: string): Promise<ActiveTask[]> {
    return await this.prisma.activeTask.findMany({
      where: {
        userId,
        type,
      },
    });
  }

  async create(userId: string, type: string): Promise<ActiveTask> {
    return await this.prisma.activeTask.create({
      data: {
        type,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async delete(userId: string, id: string): Promise<ActiveTask> {
    await this.prisma.activeTask.findFirstOrThrow({
      where: {
        userId,
      },
    });

    return await this.prisma.activeTask.delete({
      where: {
        id,
      },
    });
  }
}

export default ActiveTasksRepository;
