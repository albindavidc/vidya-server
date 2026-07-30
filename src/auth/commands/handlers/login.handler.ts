import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../login.command';
import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  I_USER_REPOSITORY,
  type IUserRepository,
} from 'src/users/interfaces/user.repository.interface';
import { HashingService } from 'src/auth/services/hashing.service';
import { TokenService } from 'src/auth/services/token.service';
import { LoginResponse } from 'src/auth/types/login-response.types';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly _userRepo: IUserRepository,
    private readonly _hashingService: HashingService,
    private readonly _tokenService: TokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponse> {
    const { email, password } = command.loginDto;

    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isPasswordValid = await this._hashingService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid Credentials');

    const tokens = await this._tokenService.generateToken({
      userId: user.id.toString(),
      email: email,
      role: user.role,
    });

    return {
      message: 'Login successful',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
