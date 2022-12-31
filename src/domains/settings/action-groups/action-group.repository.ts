import { ActionGroup, PrismaClient } from '@prisma/client';

class ActionGroupRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllBy(userId: string): Promise<ActionGroup[]> {
    return await this.prisma.actionGroup.findMany({ where: { userId } });
  }

  async create(userId: string, name: string): Promise<ActionGroup> {
    return await this.prisma.actionGroup.create({
      data: {
        name,
        userId,
      },
    });
  }
}

export default ActionGroupRepository;
