import { Action, PrismaClient } from '@prisma/client';

class ActionRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllBy(userId: string): Promise<Action[]> {
    return await this.prisma.action.findMany({ where: { userId } });
  }

  async create(userId: string, name: string, type: string, actionGroupId: string): Promise<Action> {
    return await this.prisma.action.create({
      data: {
        name,
        type,
        userId,
        actionGroupId,
      },
    });
  }
}

export default ActionRepository;
