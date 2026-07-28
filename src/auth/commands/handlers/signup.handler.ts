import {
  I_USER_REPOSITORY,
  type IUserRepository,
} from 'src/users/repositories/user.repository.interface';
import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HashingService } from 'src/auth/services/hashing.service';
import { SignupCommand } from '../signup.command';
import { UserMapper } from 'src/users/mappers/user.mapper';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  constructor(
    @Inject(I_USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly hashingService: HashingService,
    private readonly userMapper: UserMapper,
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

      const savedUser = await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });

      return this.userMapper.toResponse(savedUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create the user');
    }
  }
}
