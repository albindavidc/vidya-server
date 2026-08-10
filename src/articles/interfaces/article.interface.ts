import {
  PaginatedResultInterface,
  PaginationParamsInterface,
} from 'src/common/common.interfaces';
import { ArticleStatus } from '../article-status.enum';
import { ArticleEntity } from '../article.entity';
import { CreateArticleDto, UpdateArticleDto } from '../dto/article.schema';

export const I_ARTICLES_REPOSITORY = Symbol('IArticlesRepository');

export interface IArticlesRepository {
  create(authorId: string, data: CreateArticleDto): Promise<ArticleEntity>;
  update(articleId: string, data: UpdateArticleDto): Promise<ArticleEntity>;
  delete(articleId: string): Promise<ArticleEntity>;

  findById(articleId: string): Promise<ArticleEntity | null>;
  findByAuthorId(
    authorId: string,
    status?: ArticleStatus,
    pagination?: PaginationParamsInterface,
  ): Promise<PaginatedResultInterface<ArticleEntity>>;
}
