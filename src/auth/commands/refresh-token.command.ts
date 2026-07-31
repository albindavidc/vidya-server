import { IJwtPayload } from '../strategies/jwt-payload.interface';

export class RefreshTokenCommand {
  constructor(public readonly userPayload: IJwtPayload) {}
}
