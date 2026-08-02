import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { I_USER_REPOSITORY } from './interfaces/user.interface';
import { UserRepositoryImpl } from './repositories/user.repository';
import { I_PENDING_USER_REPOSITORY } from './interfaces/pending-user.interface';
import { PendingUserRepositoryImpl } from './repositories/pending-user.repository';
import { UserMapper } from './mappers/user.mapper';
import { UserEntity } from './entities/user.entity';
import { PendingUserEntity } from './entities/pending-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PendingUserEntity])],
  controllers: [UsersController],
  providers: [
    UserMapper,
    {
      provide: I_USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    {
      provide: I_PENDING_USER_REPOSITORY,
      useClass: PendingUserRepositoryImpl,
    },
  ],
  exports: [I_USER_REPOSITORY, I_PENDING_USER_REPOSITORY, UserMapper],
})
export class UsersModule {}
