import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';
import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepo: MongoRepository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    try {
      return await this._userRepo.findOneBy({ _id: new ObjectId(id) });
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this._userRepo.findOneBy({ email });
  }

  async save(user: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this._userRepo.create(user);
    return await this._userRepo.save(entity);
  }
}
