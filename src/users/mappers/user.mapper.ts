import { UserResponseDto } from '../dto/user-response.dto';
import { PendingSignupResponseDto } from '../dto/pending-signup-response.dto';
import { UserEntity } from '../entities/user.entity';
import { PendingUserEntity } from '../entities/pending-user.entity';

export class UserMapper {
  toResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  toPendingSignupResponse(
    pendingUser: PendingUserEntity,
  ): PendingSignupResponseDto {
    return {
      id: pendingUser.id.toString(),
      message: 'Signup pending. Please verify your OTP.',
      email: pendingUser.email,
      expiresAt: pendingUser.expiresAt,
    };
  }
}
