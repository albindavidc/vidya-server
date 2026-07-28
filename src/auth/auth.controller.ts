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
import { CommandBus } from '@nestjs/cqrs';
import { SignupCommand } from './commands/signup.command';
import { UserResponse } from 'src/users/types/user-response.types';
import { API_ROUTES } from 'src/common/constants/api-routes.constant';

@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(API_ROUTES.AUTH.SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe<SignupDto>(SignupSchema))
  async signup(@Body() signupDto: SignupDto): Promise<UserResponse> {
    return this.commandBus.execute(new SignupCommand(signupDto));
  }
}
