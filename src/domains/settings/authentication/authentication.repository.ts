import { Authentication, PrismaClient } from '@prisma/client';

class AuthenticationRepository {
  constructor(private prisma: PrismaClient) {}

  async getBy(userId: string): Promise<Authentication> {
    return await this.prisma.authentication.findUniqueOrThrow({
      where: {
        userId,
      },
    });
  }

  async create(userId: string, apiToken: string): Promise<Authentication> {
    return await this.prisma.authentication.create({
      data: {
        apiToken,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(userId: string, newApiToken: string): Promise<Authentication> {
    return await this.prisma.authentication.update({
      where: { userId },
      data: {
        apiToken: newApiToken,
      },
    });
  }

  async delete(userId: string, id: string): Promise<Authentication> {
    await this.prisma.authentication.findFirstOrThrow({
      where: {
        userId,
      },
    });

    return await this.prisma.authentication.delete({
      where: {
        id,
      },
    });
  }
}

export default AuthenticationRepository;
