import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PendingUserEntity } from '../domain/pending-user.entity';
import { PendingUserSchema } from '../schemas/pending-user.schema';
import { PendingSignupResponseDto } from '../dto/pending-signup-response.dto';

type RawDocument<T> = Partial<T> & { _id?: ObjectId };

@Injectable()
export class PendingUserMapper {
  toPersistence(
    entity: PendingUserEntity,
  ): Omit<PendingUserSchema, '_id'> & { _id?: ObjectId } {
    return {
      _id: entity.id ? new ObjectId(entity.id) : undefined,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      otpHash: entity.otpHash,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(
    raw: RawDocument<PendingUserSchema> | null,
  ): PendingUserEntity | null {
    if (!raw) return null;
    return PendingUserEntity.fromPersistence({
      id: raw._id ? raw._id.toString() : '',
      firstName: raw.firstName!,
      lastName: raw.lastName!,
      email: raw.email!,
      password: raw.password!,
      role: raw.role!,
      otpHash: raw.otpHash!,
      expiresAt: raw.expiresAt!,
      createdAt: raw.createdAt!,
      updatedAt: raw.updatedAt!,
    });
  }

  toResponse(pendingUser: PendingUserEntity): PendingSignupResponseDto {
    return {
      id: pendingUser.id.toString(),
      message: 'Signup pending. Please verify your OTP.',
      email: pendingUser.email,
      expiresAt: pendingUser.expiresAt,
    };
  }
}
