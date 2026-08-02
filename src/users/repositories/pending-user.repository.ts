import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IPendingUserRepository } from '../interfaces/pending-user.interface';
import { PendingUserEntity } from '../entities/pending-user.entity';

@Injectable()
export class PendingUserRepositoryImpl implements IPendingUserRepository {
  constructor(
    @InjectRepository(PendingUserEntity)
    private readonly _repo: MongoRepository<PendingUserEntity>,
  ) {}

  async findByEmail(email: string): Promise<PendingUserEntity | null> {
    return await this._repo.findOneBy({ email });
  }

  async save(
    pendingUser: Partial<PendingUserEntity>,
  ): Promise<PendingUserEntity> {
    try {
      const entity = this._repo.create(pendingUser);
      return await this._repo.save(entity);
    } catch (error) {
      const mongoError = error as { code?: number };
      if (mongoError.code === 11000) {
        throw new ConflictException(
          'Pending user with this email already exists.',
        );
      }
      throw new InternalServerErrorException('Failed to save pending user.');
    }
  }

  async deleteByEmail(email: string): Promise<void> {
    try {
      await this._repo.deleteMany({ email });
    } catch {
      throw new InternalServerErrorException('Failed to delete pending user.');
    }
  }
}
