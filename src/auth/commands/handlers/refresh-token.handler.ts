import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../refresh-token.command';
import { TokenService } from 'src/auth/services/token.service';
import { Login } from 'src/auth/types/login.types';
import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  I_USER_REPOSITORY,
  type IUserRepository,
} from 'src/users/interfaces/user.repository.interface';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly _userRepo: IUserRepository,
    private readonly _tokenService: TokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<Login> {
    const { userId } = command.userPayload;

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const token = await this._tokenService.generateToken({
      userId,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Token refreshed successfully',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }
}
