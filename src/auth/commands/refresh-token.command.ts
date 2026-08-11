import { Command } from '@nestjs/cqrs/dist/classes';
import { IJwtPayload } from '../strategies/jwt-payload.interface';
import { LoginResultDto } from '../dto/login.schema';

export class RefreshTokenCommand extends Command<LoginResultDto> {
  constructor(public readonly userPayload: IJwtPayload) {
    super();
  }
}
