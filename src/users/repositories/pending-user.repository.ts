import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IPendingUserRepository } from '../interfaces/pending-user.interface';
import { PendingUserEntity } from '../domain/pending-user.entity';
import { PendingUserSchema } from '../schemas/pending-user.schema';
import { PendingUserMapper } from '../mappers/pending-user.mapper';

@Injectable()
export class PendingUserRepositoryImpl implements IPendingUserRepository {
  constructor(
    @InjectRepository(PendingUserSchema)
    private readonly _repo: MongoRepository<PendingUserSchema>,
    private readonly _pendingUserMapper: PendingUserMapper,
  ) {}

  async findByEmail(email: string): Promise<PendingUserEntity | null> {
    const raw = await this._repo.findOneBy({ email });
    return this._pendingUserMapper.toDomain(raw);
  }

  async save(pendingUser: PendingUserEntity): Promise<PendingUserEntity> {
    try {
      const persistenceEntity =
        this._pendingUserMapper.toPersistence(pendingUser);
      const entity = this._repo.create(persistenceEntity);
      const saved = await this._repo.save(entity);
      return this._pendingUserMapper.toDomain(saved) as PendingUserEntity;
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
