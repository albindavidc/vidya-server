import { Query } from '@nestjs/cqrs';
import {
  PaginationParamsInterface,
  PaginatedResultInterface,
} from 'src/common/common.interfaces';
import { ArticleStatusEnum } from './article-status.enum';
import { ArticleResponseDto } from './dto/article-response.dto';

export class ArticleQuery extends Query<
  PaginatedResultInterface<ArticleResponseDto>
> {
  constructor(
    public readonly authorId: string,
    public readonly status?: ArticleStatusEnum,
    public readonly pagination?: PaginationParamsInterface,
  ) {
    super();
  }
}
