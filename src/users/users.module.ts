import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { I_USER_REPOSITORY } from './repositories/user.repository.interface';
import { UserRepositoryImpl } from './repositories/user.repository-impl';
import { I_PENDING_USER_REPOSITORY } from './repositories/pending-user.repository.interface';
import { PendingUserRepositoryImpl } from './repositories/pending-user.repository-impl';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: I_USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    {
      provide: I_PENDING_USER_REPOSITORY,
      useClass: PendingUserRepositoryImpl,
    },
  ],
  exports: [I_USER_REPOSITORY, I_PENDING_USER_REPOSITORY],
})
export class UsersModule {}
