import { UserResponse } from '../types/user-response.types';
import { UserEntity } from '../user.entity';

export class UserMapper {
  toResponse(user: UserEntity): UserResponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
