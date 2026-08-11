import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArticle } from '../get-article.query';
import { ArticleResponseDto } from '../../dto/article-response.dto';
import {
  I_ARTICLES_REPOSITORY,
  type IArticlesRepository,
} from 'src/articles/interfaces/article.interface';
import { Inject, NotFoundException } from '@nestjs/common';

import { ArticleMapper } from '../../mappers/article.mapper';

@QueryHandler(GetArticle)
export class GetArticlesHandler implements IQueryHandler<GetArticle> {
  constructor(
    @Inject(I_ARTICLES_REPOSITORY)
    private readonly _articleRepo: IArticlesRepository,
    private readonly _articleMapper: ArticleMapper,
  ) {}

  async execute(query: GetArticle): Promise<ArticleResponseDto> {
    const article = await this._articleRepo.findById(query.articleId);

    if (!article) {
      throw new NotFoundException(`Article not found`);
    }

    return this._articleMapper.toResponse(article);
  }
}
