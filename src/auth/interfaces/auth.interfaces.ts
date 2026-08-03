import { Request } from 'express';
import { IJwtPayload } from '../strategies/jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: IJwtPayload;
}
