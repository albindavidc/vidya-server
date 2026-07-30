import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HashingService } from './auth/services/hashing.service';
import { AuthController } from './auth/auth.controller';
import { SignupHandler } from './auth/commands/handlers/signup.handler';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { VerifyOtpHandler } from './auth/commands/handlers/verify-otp.handler';
import { AppController } from './app.controller';
import { TokenService } from './auth/services/token.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('DATABASE_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoLoadEntities: true,
        synchronize: true, // Note: turn off in production
      }),
    }),
    UsersModule,
    CqrsModule,
    MailModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    HashingService,
    SignupHandler,
    VerifyOtpHandler,
    TokenService,
  ],
})
export class AppModule {}
