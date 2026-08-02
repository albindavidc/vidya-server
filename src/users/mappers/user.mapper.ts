import {
  PendingSignupResponse,
  UserResponse,
} from '../types/user-response.types';
import { UserEntity } from '../entities/user.entity';
import { PendingUserEntity } from '../entities/pending-user.entity';

export class UserMapper {
  toResponse(user: UserEntity): UserResponse {
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
  ): PendingSignupResponse {
    return {
      id: pendingUser.id.toString(),
      message: 'Signup pending. Please verify your OTP.',
      email: pendingUser.email,
      expiresAt: pendingUser.expiresAt,
    };
  }
}
