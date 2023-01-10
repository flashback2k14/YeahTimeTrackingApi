import { Action, PrismaClient } from '@prisma/client';

class ActionRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllBy(userId: string): Promise<Action[]> {
    return await this.prisma.action.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        actionGroup: true,
      },
    });
  }

  async create(userId: string, name: string, type: string, actionGroupId: string): Promise<Action> {
    return await this.prisma.action.create({
      data: {
        name,
        type,
        user: {
          connect: {
            id: userId,
          },
        },
        actionGroup: {
          connect: {
            id: actionGroupId,
          },
        },
      },
    });
  }

  async update(userId: string, id: string, newName: string, newType: string): Promise<Action> {
    await this.prisma.action.findFirstOrThrow({
      where: {
        userId,
      },
    });

    return await this.prisma.action.update({
      where: {
        id,
      },
      data: {
        name: newName,
        type: newType,
      },
    });
  }

  async delete(userId: string, id: string): Promise<Action> {
    await this.prisma.action.findFirstOrThrow({
      where: {
        userId,
      },
    });

    return await this.prisma.action.delete({
      where: {
        id,
      },
    });
  }
}

export default ActionRepository;
