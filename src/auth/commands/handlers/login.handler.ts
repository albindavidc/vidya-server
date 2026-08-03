import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../login.command';
import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  I_USER_REPOSITORY,
  type IUserRepository,
} from 'src/users/interfaces/user.interface';
import { HashingService } from 'src/auth/services/hashing.service';
import { TokenService } from 'src/auth/services/token.service';
import { LoginResultDto } from 'src/auth/dto/login.schema';
import { UserMapper } from 'src/users/mappers/user.mapper';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly _userRepo: IUserRepository,
    private readonly _hashingService: HashingService,
    private readonly _tokenService: TokenService,
    private readonly _userMapper: UserMapper,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResultDto> {
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
      user: this._userMapper.toResponse(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
