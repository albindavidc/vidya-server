import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { I_USER_REPOSITORY } from './repositories/user.repository.interface';
import { UserRepositoryImpl } from './repositories/user.repository-impl';
import { I_PENDING_USER_REPOSITORY } from './repositories/pending-user.repository.interface';
import { PendingUserRepositoryImpl } from './repositories/pending-user.repository-impl';
import { UserMapper } from './mappers/user.mapper';
import { UserEntity } from './user.entity';
import { PendingUserEntity } from './pending-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PendingUserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
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
