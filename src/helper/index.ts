import { User } from '@prisma/client';
import { AES, enc } from 'crypto-js';
import { sign, verify } from 'jsonwebtoken';

const pwSecret = process.env.PW_SECRET || 'ksdkvjeuf8rio32vn3oigu4389gji';
const tokenSecret = process.env.TOKEN_SECRET || 'sölfierghjfdgjhjekg';
const tokenExpires = process.env.TOKEN_EXPIRES || '1d';
const tokenIssuer = process.env.TOKEN_ISSUER || 'Dev Issuer';

export interface VerifyTokenResult {
  type: 'SUCCESS' | 'ERROR';
  body: string;
}

export function encrypt(text: string): string {
  return AES.encrypt(text, pwSecret).toString();
}

export function decrypt(text: string): string {
  return AES.decrypt(text.toString(), pwSecret).toString(enc.Utf8);
}

export function createToken(user: User): string {
  return sign(user, tokenSecret, {
    expiresIn: tokenExpires,
    issuer: tokenIssuer,
  });
}

export function verifyToken(token: string): VerifyTokenResult {
  try {
    const decoded = verify(token, tokenSecret);
    return {
      type: 'SUCCESS',
      body: JSON.stringify(decoded),
    };
  } catch (error: any) {
    let msg = 'Failed to authenticate token.';

    if (error.name === 'TokenExpiredError') {
      msg = `${msg} Token expired at ${error.expiredAt}`;
    }

    if (error.name === 'JsonWebTokenError') {
      msg = `${msg} Error message: ${error.message}`;
    }

    return {
      type: 'ERROR',
      body: msg,
    };
  }
}
