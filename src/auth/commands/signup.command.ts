import { SignupDto } from 'src/auth/dto/signup.schema';

export class SignupCommand {
  constructor(public readonly signupDto: SignupDto) {}
}
