import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  type GetArticleRequestDto,
  GetArticleRequestSchema,
} from './dto/article.schema';
import { QueryBus } from '@nestjs/cqrs';
import { ArticleQuery } from './article.query';
import type { RequestWithUser } from 'src/auth/interfaces/auth.interfaces';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly _queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ZodValidationPipe<GetArticleRequestDto>(GetArticleRequestSchema),
  )
  @UseGuards(JwtAuthGuard)
  async getArticles(
    @Request() req: RequestWithUser,
    @Query() queryDto: GetArticleRequestDto,
  ) {
    return this._queryBus.execute(
      new ArticleQuery(req.user.userId, queryDto.status, queryDto),
    );
  }
}
