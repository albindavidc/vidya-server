import { LoginRequestDto } from '../dto/login.schema';
import { Command } from '@nestjs/cqrs/dist/classes';
import { LoginResultDto } from '../dto/login.schema';

export class LoginCommand extends Command<LoginResultDto> {
  constructor(public readonly loginDto: LoginRequestDto) {
    super();
  }
}
