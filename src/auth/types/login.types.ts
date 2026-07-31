import { UserResponse } from 'src/users/types/user-response.types';

export type Login = {
  message: string;
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
};
