import { Action, ActionGroup, Authentication, PrismaClient } from '@prisma/client';

class SettingRepository {
  constructor(private prisma: PrismaClient) {}

  async getAuthentification(userId: string): Promise<Authentication> {
    return await this.prisma.authentication.findUniqueOrThrow({ where: { userId } });
  }

  async createAuthentification(userId: string, apiToken: string): Promise<Authentication> {
    return await this.prisma.authentication.create({
      data: {
        apiToken,
        userId,
      },
    });
  }

  async getActionGroups(userId: string): Promise<ActionGroup[]> {
    return await this.prisma.actionGroup.findMany({ where: { userId } });
  }

  async createActionGroup(userId: string, name: string): Promise<ActionGroup> {
    return await this.prisma.actionGroup.create({
      data: {
        name,
        userId,
      },
    });
  }

  async getActions(userId: string): Promise<Action[]> {
    return await this.prisma.action.findMany({ where: { userId } });
  }

  async createAction(
    userId: string,
    name: string,
    type: string,
    actionGroupId: string
  ): Promise<Action> {
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

export default SettingRepository;
