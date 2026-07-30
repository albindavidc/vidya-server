import { LoginRequestDto } from '../dto/login.schema';

export class LoginCommand {
  constructor(public readonly loginDto: LoginRequestDto) {}
}
