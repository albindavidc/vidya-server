import { UserResponseDto } from 'src/users/dto/user-response.dto';

export type Login = {
  message: string;
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
};
