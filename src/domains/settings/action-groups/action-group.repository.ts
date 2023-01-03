import { Action, ActionGroup, Prisma, PrismaClient } from '@prisma/client';

class ActionGroupRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllBy(userId: string): Promise<ActionGroup[]> {
    return await this.prisma.actionGroup.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        actions: true,
      },
    });
  }

  async create(userId: string, name: string): Promise<ActionGroup> {
    return await this.prisma.actionGroup.create({
      data: {
        name,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(id: string, newName: string): Promise<ActionGroup> {
    return await this.prisma.actionGroup.update({
      where: {
        id,
      },
      data: {
        name: newName,
      },
    });
  }

  async delete(id: string): Promise<ActionGroup> {
    return await this.prisma.actionGroup.delete({
      where: {
        id,
      },
    });
  }
}

export default ActionGroupRepository;
