import { Role } from '../role.enum';

export type CreateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
};
