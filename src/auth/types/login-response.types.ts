import { Role } from 'src/users/user.entity';

export type LoginResponse = {
  message: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
};
