import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation/zod-validation.pipe';
import { type SignupDto, SignupSchema } from './dto/signup.schema';
import { type VerifyOtpDto, VerifyOtpSchema } from './dto/verify-otp.schema';
import { CommandBus } from '@nestjs/cqrs';
import { SignupCommand } from './commands/signup.command';
import { VerifyOtpCommand } from './commands/verify-otp.command';
import {
  type PendingSignupResponse,
  type UserResponse,
} from 'src/users/types/user-response.types';
import { API_ROUTES } from 'src/common/constants/api-routes.constant';
import {
  type LoginRequestDto,
  LoginResponseDto,
  LoginSchema,
} from './dto/login.schema';
import { LoginCommand } from './commands/login.command';
import { type Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { type Login } from './types/login.types';
import ms, { type StringValue } from 'ms';

@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _config: ConfigService,
  ) {}

  @Post(API_ROUTES.AUTH.SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe<SignupDto>(SignupSchema))
  async signup(@Body() signupDto: SignupDto): Promise<PendingSignupResponse> {
    return this._commandBus.execute(new SignupCommand(signupDto));
  }

  @Post(API_ROUTES.AUTH.VERIFY_OTP)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe<VerifyOtpDto>(VerifyOtpSchema))
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<UserResponse> {
    return this._commandBus.execute(new VerifyOtpCommand(verifyOtpDto));
  }

  @Post(API_ROUTES.AUTH.LOGIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe<LoginRequestDto>(LoginSchema))
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const result = await this._commandBus.execute<Login>(
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
}
