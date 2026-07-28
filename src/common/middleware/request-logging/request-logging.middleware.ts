import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name);

  use(req: Request, res: Response, next: () => void) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    });

    next();
  }
}
