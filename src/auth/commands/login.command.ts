import { LoginRequestDto } from '../dto/login.schema';
import { Command } from '@nestjs/cqrs/dist/classes';
import { type Login } from '../types/login.types';

export class LoginCommand extends Command<Login> {
  constructor(public readonly loginDto: LoginRequestDto) {
    super();
  }
}
