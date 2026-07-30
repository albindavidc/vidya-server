import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = AuthenticatedUser>(
    err: Error | null,
    user: AuthenticatedUser | null,
    info: Error,
  ): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(info?.message || 'Authentication Failed')
      );
    }

    return user as TUser;
  }
}
