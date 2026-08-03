import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { type SignupDto, SignupSchema } from './dto/signup.schema';
import { type VerifyOtpDto, VerifyOtpSchema } from './dto/verify-otp.schema';
import { CommandBus } from '@nestjs/cqrs';
import { SignupCommand } from './commands/signup.command';
import { VerifyOtpCommand } from './commands/verify-otp.command';
import { type UserResponseDto } from 'src/users/dto/user-response.dto';
import { type PendingSignupResponseDto } from 'src/users/dto/pending-signup-response.dto';
import { API_ROUTES } from 'src/common/constants/api-routes.constant';
import {
  type LoginRequestDto,
  LoginResponseDto,
  LoginSchema,
} from './dto/login.schema';
import { LoginCommand } from './commands/login.command';
import { type Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { type LoginResultDto } from './dto/login.schema';
import ms, { type StringValue } from 'ms';
import { RefreshTokenCommand } from './commands/refresh-token.command';
import type { RequestWithUser } from './interfaces/auth.interfaces';

@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _config: ConfigService,
  ) {}

  @Post(API_ROUTES.AUTH.SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe<SignupDto>(SignupSchema))
  async signup(
    @Body() signupDto: SignupDto,
  ): Promise<PendingSignupResponseDto> {
    return this._commandBus.execute(new SignupCommand(signupDto));
  }

  @Post(API_ROUTES.AUTH.VERIFY_OTP)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe<VerifyOtpDto>(VerifyOtpSchema))
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<UserResponseDto> {
    return this._commandBus.execute(new VerifyOtpCommand(verifyOtpDto));
  }

  @Post(API_ROUTES.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe<LoginRequestDto>(LoginSchema))
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const result = await this._commandBus.execute<LoginResultDto>(
      new LoginCommand(loginDto),
    );

    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this._config.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: ms(this._config.getOrThrow<StringValue>('JWT_ACCESS_EXPIRES_IN')),
    });

    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this._config.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: ms(
        this._config.getOrThrow<StringValue>('JWT_REFRESH_EXPIRES_IN'),
      ),
    });

    return {
      user: result.user,
      message: result.message,
    };
  }

  @Post(API_ROUTES.AUTH.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Request() req: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const result = await this._commandBus.execute<LoginResultDto>(
      new RefreshTokenCommand(req.user),
    );

    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this._config.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: ms(this._config.getOrThrow<StringValue>('JWT_ACCESS_EXPIRES_IN')),
    });

    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: this._config.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: ms(
        this._config.getOrThrow<StringValue>('JWT_REFRESH_EXPIRES_IN'),
      ),
    });

    return {
      user: result.user,
      message: result.message,
    };
  }
}
