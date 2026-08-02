import { UserEntity } from '../entities/user.entity';

export const I_USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: Partial<UserEntity>): Promise<UserEntity>;
}
