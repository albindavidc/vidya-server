import { Role } from '../role.enum';

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type PendingSignupResponse = {
  id: string;
  message: string;
  email: string;
  expiresAt: Date;
};
