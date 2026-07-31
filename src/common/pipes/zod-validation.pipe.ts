import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<T, T> {
  constructor(private _schema: ZodType<T>) {}

  transform(value: T): T {
    try {
      return this._schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Invalid request payload',
          error: error.issues,
        });
      }

      throw new BadRequestException('Invalid request payload');
    }
  }
}
