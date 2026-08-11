import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../interfaces/user.interface';
import { UserEntity } from '../domain/user.entity';
import { UserSchema } from '../schemas/user.schema';
import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly _userRepo: MongoRepository<UserSchema>,
    private readonly _userMapper: UserMapper,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const raw = await this._userRepo.findOneBy({ _id: new ObjectId(id) });
      return this._userMapper.toDomain(raw);
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this._userRepo.findOneBy({ email });
    return this._userMapper.toDomain(raw);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const persistenceEntity = this._userMapper.toPersistence(user);
    const entity = this._userRepo.create(persistenceEntity);
    const saved = await this._userRepo.save(entity);
    return this._userMapper.toDomain(saved) as UserEntity;
  }
}
