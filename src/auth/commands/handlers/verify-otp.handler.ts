import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyOtpCommand } from '../verify-otp.command';
import { BadRequestException, Inject } from '@nestjs/common';
import {
  type IPendingUserRepository,
  I_PENDING_USER_REPOSITORY,
} from 'src/users/repositories/pending-user.repository.interface';
import {
  type IUserRepository,
  I_USER_REPOSITORY,
} from 'src/users/repositories/user.repository.interface';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { type UserResponse } from 'src/users/types/user-response.types';
import { HashingService } from '../../services/hashing.service';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  constructor(
    @Inject(I_PENDING_USER_REPOSITORY)
    private readonly _pendingUserRepo: IPendingUserRepository,
    @Inject(I_USER_REPOSITORY)
    private readonly _userRepository: IUserRepository,
    private readonly _userMapper: UserMapper,
    private readonly _hashingService: HashingService,
  ) {}

  async execute(command: VerifyOtpCommand): Promise<UserResponse> {
    const { email, otp } = command.dto;

    const pendingUser = await this._pendingUserRepo.findByEmail(email);
    if (!pendingUser) {
      throw new BadRequestException(
        'Pending registration not found or expired.',
      );
    }

    const isOtpValid = await this._hashingService.compare(
      otp,
      pendingUser.otpHash,
    );
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP.');
    }

    if (new Date() > pendingUser.expiresAt) {
      await this._pendingUserRepo.deleteByEmail(email);
      throw new BadRequestException('OTP has expired.');
    }

    const newUser = await this._userRepository.save({
      email: pendingUser.email,
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      password: pendingUser.password,
      role: pendingUser.role,
    });

    await this._pendingUserRepo.deleteByEmail(email);

    return this._userMapper.toResponse(newUser);
  }
}
