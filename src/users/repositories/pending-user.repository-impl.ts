import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IPendingUserRepository } from './pending-user.repository.interface';
import { PendingUserEntity } from '../pending-user.entity';

@Injectable()
export class PendingUserRepositoryImpl implements IPendingUserRepository {
  constructor(
    @InjectRepository(PendingUserEntity)
    private readonly repo: Repository<PendingUserEntity>,
  ) {}

  async findByEmail(email: string): Promise<PendingUserEntity | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async save(
    pendingUser: Partial<PendingUserEntity>,
  ): Promise<PendingUserEntity> {
    const entity = this.repo.create(pendingUser);
    return await this.repo.save(entity);
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.repo.delete({ email });
  }
}
