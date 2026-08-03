import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { SignupHandler } from './commands/handlers/signup.handler';
import { VerifyOtpHandler } from './commands/handlers/verify-otp.handler';
import { LoginHandler } from './commands/handlers/login.handler';
import { RefreshTokenHandler } from './commands/handlers/refresh-token.handler';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [CqrsModule, UsersModule, MailModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    HashingService,
    TokenService,
    SignupHandler,
    VerifyOtpHandler,
    LoginHandler,
    RefreshTokenHandler,
    JwtStrategy,
  ],
})
export class AuthModule {}
