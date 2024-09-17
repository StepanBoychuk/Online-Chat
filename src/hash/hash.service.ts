import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HashService {
  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        process.env.PASSWORD_SALT,
        100000,
        64,
        'sha512',
        (error, derivedKey) => {
          if (error) reject(error);
          resolve(derivedKey.toString('hex'));
        },
      );
    });
  }
}
