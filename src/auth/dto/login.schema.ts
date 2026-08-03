import { UserResponseDto } from 'src/users/dto/user-response.dto';
import z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export type LoginRequestDto = z.infer<typeof LoginSchema>;

export class LoginResponseDto {
  user: UserResponseDto;
  message: string;
}

export class LoginResultDto extends LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}
