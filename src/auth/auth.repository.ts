import { PrismaClient, User } from '@prisma/client';
import { createToken, decrypt, encrypt } from '../helper';

export type AuthUser = Pick<User, 'id' | 'email' | 'name' | 'createdAt' | 'updatedAt'>;

export interface SignInResult {
  token: string;
  user: AuthUser;
}

export interface SignUpResult {
  user: AuthUser;
}

class AuthRepository {
  constructor(private prisma: PrismaClient) {}

  async signIn(email: string, password: string): Promise<SignInResult> {
    // try to find the user
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // validate founduser
    if (!foundUser) {
      throw new Error('Authentication failed. User not found.');
    }

    if (password !== decrypt(foundUser.pwHash)) {
      throw new Error('Authentication failed. Wrong password.');
    }

    // create a token
    const token = createToken(foundUser);

    // delete password before return the user
    const { pwHash, ...user } = foundUser;

    // return result
    return {
      token,
      user,
    };
  }

  async signUp(email: string, password: string): Promise<SignUpResult> {
    // try to find the user
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // check if user is available
    if (foundUser) {
      throw new Error('Username is already registered. Please use another Username.');
    }

    // create new User object
    const newUser = await this.prisma.user.create({
      data: {
        email,
        pwHash: encrypt(password),
        name: email.split('@')[0],
      },
    });

    // delete password before return the user
    const { pwHash, ...user } = newUser;

    // return result
    return {
      user,
    };
  }
}

export default AuthRepository;
