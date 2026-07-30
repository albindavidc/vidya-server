import { Role } from 'src/users/user.entity';

export interface IJwtPayload {
  userId: string;
  email: string;
  role: Role;
}
