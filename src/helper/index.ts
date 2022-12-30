import { User } from '@prisma/client';
import { AES, enc } from 'crypto-js';
import { sign } from 'jsonwebtoken';

const pwSecret = process.env.PW_SECRET || 'ksdkvjeuf8rio32vn3oigu4389gji';
const tokenSecret = process.env.TOKEN_SECRET || 'sölfierghjfdgjhjekg';
const tokenExpires = process.env.TOKEN_EXPIRES || '1d';
const tokenIssuer = process.env.TOKEN_ISSUER || 'Dev Issuer';

export function encrypt(text: string): string {
  return AES.encrypt(text, pwSecret).toString();
}

export function decrypt(text: string): string {
  return AES.decrypt(text.toString(), pwSecret).toString(enc.Utf8);
}

export function createToken(user: User) {
  return sign(user, tokenSecret, {
    expiresIn: tokenExpires,
    issuer: tokenIssuer,
  });
}
