import {
  PaginatedResultInterface,
  PaginationParamsInterface,
} from 'src/common/common.interfaces';
import { ArticleStatus } from '../article-status.enum';
import { ArticleEntity } from '../article.entity';

export const I_ARTICLES_REPOSITORY = Symbol('IArticlesRepository');

export interface IArticlesRepository {
  findByAuthorId(
    authorId: string,
    status?: ArticleStatus,
    pagination?: PaginationParamsInterface,
  ): Promise<PaginatedResultInterface<ArticleEntity>>;
}
