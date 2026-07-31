import { Command } from '@nestjs/cqrs/dist/classes';
import { IJwtPayload } from '../strategies/jwt-payload.interface';
import { type Login } from '../types/login.types';

export class RefreshTokenCommand extends Command<Login> {
  constructor(public readonly userPayload: IJwtPayload) {
    super();
  }
}
