import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HashingService } from './auth/services/hashing.service';
import { AuthController } from './auth/auth.controller';
import { SignupHandler } from './auth/commands/handlers/signup.handler';

import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    CqrsModule,
    MailModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, HashingService, SignupHandler],
})
export class AppModule {}
