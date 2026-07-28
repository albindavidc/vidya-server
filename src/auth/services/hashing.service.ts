import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashingService {
  async hash(data: string): Promise<string> {
    try {
      return await argon2.hash(data, { type: argon2.argon2id });
    } catch (error) {
      throw new InternalServerErrorException('Failed to hash password', {
        cause: error,
      });
    }
  }
}
