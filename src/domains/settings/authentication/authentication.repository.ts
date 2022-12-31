import { Authentication, PrismaClient } from '@prisma/client';

class AuthenticationRepository {
  constructor(private prisma: PrismaClient) {}

  async getBy(userId: string): Promise<Authentication> {
    return await this.prisma.authentication.findUniqueOrThrow({ where: { userId } });
  }

  async create(userId: string, apiToken: string): Promise<Authentication> {
    return await this.prisma.authentication.create({
      data: {
        apiToken,
        userId,
      },
    });
  }
}

export default AuthenticationRepository;
