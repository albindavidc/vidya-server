import {
  I_USER_REPOSITORY,
  type IUserRepository,
} from 'src/users/repositories/user.repository.interface';
import {
  I_PENDING_USER_REPOSITORY,
  type IPendingUserRepository,
} from 'src/users/repositories/pending-user.repository.interface';
import * as crypto from 'crypto';
import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HashingService } from 'src/auth/services/hashing.service';
import { SignupCommand } from '../signup.command';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { MailService } from 'src/mail/mail.service';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  constructor(
    @Inject(I_USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(I_PENDING_USER_REPOSITORY)
    private readonly pendingUserRepository: IPendingUserRepository,
    private readonly hashingService: HashingService,
    private readonly userMapper: UserMapper,
    private readonly mailService: MailService,
  ) {}

  async execute(command: SignupCommand) {
    const { firstName, lastName, email, password, role } = command.signupDto;

    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ConflictException(
          'User already exists with this email address!',
        );
      }

      const hashedPassword = await this.hashingService.hash(password);

      const otp = crypto.randomInt(100000, 999999).toString();
      const otpHash = await this.hashingService.hash(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await this.pendingUserRepository.deleteByEmail(email);

      const savedPendingUser = await this.pendingUserRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        otpHash,
        expiresAt,
      });

      // Dispatch the OTP email!
      await this.mailService.sendOtpEmail(email, otp);

      // Return the pending response without exposing the OTP directly to the client
      return this.userMapper.toPendingSignupResponse(savedPendingUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create the user');
    }
  }
}
