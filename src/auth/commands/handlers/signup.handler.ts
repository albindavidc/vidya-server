import {
  I_USER_REPOSITORY,
  type IUserRepository,
} from 'src/users/interfaces/user.interface';
import {
  I_PENDING_USER_REPOSITORY,
  type IPendingUserRepository,
} from 'src/users/interfaces/pending-user.interface';
import * as crypto from 'crypto';
import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HashingService } from 'src/auth/services/hashing.service';
import { SignupCommand } from '../signup.command';
import { PendingUserMapper } from 'src/users/mappers/pending-user.mapper';
import { I_MAIL_SERVICE, type IMailService } from 'src/mail/mail.interface';
import { PendingUserEntity } from 'src/users/domain/pending-user.entity';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly _userRepository: IUserRepository,
    @Inject(I_PENDING_USER_REPOSITORY)
    private readonly _pendingUserRepository: IPendingUserRepository,
    private readonly _hashingService: HashingService,
    private readonly _pendingUserMapper: PendingUserMapper,
    @Inject(I_MAIL_SERVICE)
    private readonly _mailService: IMailService,
  ) {}

  async execute(command: SignupCommand) {
    const { firstName, lastName, email, password, role } = command.signupDto;

    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        'User already exists with this email address!',
      );
    }

    const hashedPassword = await this._hashingService.hash(password);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await this._hashingService.hash(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this._pendingUserRepository.deleteByEmail(email);

    const pendingUserEntity = PendingUserEntity.create({
      id: '', // Empty ID initially, will be created/ignored by MongoDB, but domain expects a string. Or use new ObjectId().toString()
      firstName,
      lastName,
      email,
      hashedPassword,
      role,
      otpHash,
      expiresAt,
    });

    const savedPendingUser =
      await this._pendingUserRepository.save(pendingUserEntity);

    await this._mailService.sendOtpEmail(email, otp);

    return this._pendingUserMapper.toResponse(savedPendingUser);
  }
}
