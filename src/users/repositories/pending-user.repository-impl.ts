import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IPendingUserRepository } from './pending-user.repository.interface';
import { PendingUserEntity } from '../pending-user.entity';

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
    if (pendingUser.id) {
      await this._repo.update(pendingUser.id, pendingUser);
      return (await this.findByEmail(
        pendingUser.email as string,
      )) as PendingUserEntity;
    }
    const entity = this._repo.create(pendingUser);
    return await this._repo.save(entity);
  }

  async deleteByEmail(email: string): Promise<void> {
    await this._repo.delete({ email });
  }
}
