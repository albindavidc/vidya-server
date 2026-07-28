import { PendingUserEntity } from '../pending-user.entity';

export const I_PENDING_USER_REPOSITORY = Symbol('IPendingUserRepository');

export interface IPendingUserRepository {
  findByEmail(email: string): Promise<PendingUserEntity | null>;
  save(pendingUser: Partial<PendingUserEntity>): Promise<PendingUserEntity>;
  deleteByEmail(email: string): Promise<void>;
}
