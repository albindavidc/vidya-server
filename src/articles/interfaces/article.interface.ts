import {
  PaginatedResultInterface,
  PaginationParamsInterface,
} from 'src/common/common.interfaces';
import { ArticleStatus } from '../article-status.enum';
import { ArticleEntity } from '../domain/article.entity';

export const I_ARTICLES_REPOSITORY = Symbol('IArticlesRepository');

export interface IArticlesRepository {
  save(article: ArticleEntity): Promise<ArticleEntity>;
  delete(articleId: string): Promise<void>;

  findById(articleId: string): Promise<ArticleEntity | null>;
  findByAuthorId(
    authorId: string,
    status?: ArticleStatus,
    pagination?: PaginationParamsInterface,
  ): Promise<PaginatedResultInterface<ArticleEntity>>;
}
