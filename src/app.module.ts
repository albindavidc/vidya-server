import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HashingService } from './auth/services/hashing.service';
import { AuthControllerController } from './auth/auth.controller.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [UsersModule],
  controllers: [AppController, AuthControllerController, AuthController],
  providers: [AppService, HashingService],
})
export class AppModule {}
