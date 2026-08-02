import { Role } from 'src/users/role.enum';

export interface IJwtPayload {
  userId: string;
  email: string;
  role: Role;
}
