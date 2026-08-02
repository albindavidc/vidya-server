import { Role } from 'src/users/role.enum';
import z from 'zod';

export const SignupSchema = z.object({
  firstName: z.string().min(1, { message: 'firstname is required' }),
  lastName: z.string().min(1, { message: 'lastname is required' }),
  email: z.string().email({ message: 'invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain 1 uppercase alphabet' })
    .regex(/[0-9]/, { message: 'Password must contain 1 number' }),
  role: z.nativeEnum(Role).default(Role.USER),
});

export type SignupDto = z.infer<typeof SignupSchema>;
