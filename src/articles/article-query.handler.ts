import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArticleQuery } from './article.query';
import { Inject } from '@nestjs/common';
import {
  I_ARTICLES_REPOSITORY,
  type IArticlesRepository,
} from './interfaces/article.interface';
import { PaginatedResultInterface } from 'src/common/common.interfaces';
import { ArticleResponseDto } from './dto/article-response.dto';

import { ArticleMapper } from './mappers/article.mapper';

@QueryHandler(ArticleQuery)
export class ArticleQueryHandler implements IQueryHandler<ArticleQuery> {
  constructor(
    @Inject(I_ARTICLES_REPOSITORY)
    private readonly _articleRepo: IArticlesRepository,
    private readonly _articleMapper: ArticleMapper,
  ) {}

  async execute(
    query: ArticleQuery,
  ): Promise<PaginatedResultInterface<ArticleResponseDto>> {
    const result = await this._articleRepo.findByAuthorId(
      query.authorId,
      query.status,
      query.pagination,
    );

    return {
      ...result,
      data: result.data.map((article) =>
        this._articleMapper.toResponseDto(article),
      ),
    };
  }
}
