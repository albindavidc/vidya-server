import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from './user.repository.interface';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async save(user: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this.userRepo.create(user);
    return await this.userRepo.save(entity);
  }
}
