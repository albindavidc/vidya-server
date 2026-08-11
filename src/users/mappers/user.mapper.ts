import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UserEntity } from '../domain/user.entity';
import { UserSchema } from '../schemas/user.schema';
import { UserResponseDto } from '../dto/user-response.dto';

type RawDocument<T> = Partial<T> & { _id?: ObjectId };

@Injectable()
export class UserMapper {
  toPersistence(
    entity: UserEntity,
  ): Omit<UserSchema, '_id'> & { _id?: ObjectId } {
    return {
      _id: entity.id ? new ObjectId(entity.id) : undefined,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(raw: RawDocument<UserSchema> | null): UserEntity | null {
    if (!raw) return null;
    return UserEntity.fromPersistence({
      id: raw._id ? raw._id.toString() : '',
      firstName: raw.firstName!,
      lastName: raw.lastName!,
      email: raw.email!,
      password: raw.password!,
      role: raw.role!,
      createdAt: raw.createdAt!,
      updatedAt: raw.updatedAt!,
    });
  }

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
}
