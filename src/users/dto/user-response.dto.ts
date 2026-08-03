import { Role } from '../role.enum';

export type UserResponseDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};
