import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { I_USER_REPOSITORY } from './interfaces/user.interface';
import { UserRepositoryImpl } from './repositories/user.repository';
import { I_PENDING_USER_REPOSITORY } from './interfaces/pending-user.interface';
import { PendingUserRepositoryImpl } from './repositories/pending-user.repository';
import { UserMapper } from './mappers/user.mapper';
import { UserSchema } from './schemas/user.schema';
import { PendingUserSchema } from './schemas/pending-user.schema';
import { PendingUserMapper } from './mappers/pending-user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema, PendingUserSchema])],
  controllers: [UsersController],
  providers: [
    UserMapper,
    PendingUserMapper,
    {
      provide: I_USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    {
      provide: I_PENDING_USER_REPOSITORY,
      useClass: PendingUserRepositoryImpl,
    },
  ],
  exports: [
    I_USER_REPOSITORY,
    I_PENDING_USER_REPOSITORY,
    UserMapper,
    PendingUserMapper,
  ],
})
export class UsersModule {}
