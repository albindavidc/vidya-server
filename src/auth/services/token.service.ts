import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IJwtPayload } from '../strategies/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

export interface IToken {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _config: ConfigService,
  ) {}

  async generateToken(payload: IJwtPayload): Promise<IToken> {
    const [accessToken, refreshToken] = await Promise.all([
      this._jwtService.signAsync(payload, {
        secret: this._config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this._config.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
        ) as JwtSignOptions['expiresIn'],
      }),

      this._jwtService.signAsync(payload, {
        secret: this._config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this._config.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
        ) as JwtSignOptions['expiresIn'],
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
