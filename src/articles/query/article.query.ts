import { Query } from '@nestjs/cqrs';
import {
  PaginationParamsInterface,
  PaginatedResultInterface,
} from 'src/common/common.interfaces';
import { ArticleStatus } from '../article-status.enum';
import { ArticleResponseDto } from '../dto/article-response.dto';

export class ArticleQuery extends Query<
  PaginatedResultInterface<ArticleResponseDto>
> {
  constructor(
    public readonly authorId: string,
    public readonly status?: ArticleStatus,
    public readonly pagination?: PaginationParamsInterface,
  ) {
    super();
  }
}
