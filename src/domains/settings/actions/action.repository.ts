import { Action, Prisma, PrismaClient } from '@prisma/client';

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
        // userId,
        // actionGroupId,
        user: {
          connect: {
            id: userId,
          },
        },
        actionGroup: {
          connect: {
            id: actionGroupId,
          },
          // connectOrCreate: {
          //   where: {
          //     id: actionGroupId,
          //   },
          //   create: {
          //     id: actionGroupId,
          //     name: `Unknown action group ${Date.now()}`,
          //     user: {
          //       connect: {
          //         id: userId,
          //       },
          //     },
          //   },
          // },
        },
      },
    });
  }

  async update(id: string, newName: string, newType: string): Promise<Action> {
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

  async delete(id: string): Promise<Action> {
    return await this.prisma.action.delete({
      where: {
        id,
      },
    });
  }
}

export default ActionRepository;
