import {
  PaginatedResultInterface,
  PaginationParamsInterface,
} from 'src/common/common.interfaces';
import { ArticleStatusEnum } from '../article-status.enum';
import { ArticleEntity } from '../article.entity';

export const I_ARTICLES_REPOSITORY = Symbol('IArticlesRepository');

export interface IArticlesRepository {
  findByAuthorId(
    authorId: string,
    status?: ArticleStatusEnum,
    pagination?: PaginationParamsInterface,
  ): Promise<PaginatedResultInterface<ArticleEntity>>;
}
