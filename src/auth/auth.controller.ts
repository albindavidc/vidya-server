import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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

@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(private readonly _commandBus: CommandBus) {}

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
}
