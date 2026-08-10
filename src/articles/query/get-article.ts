import { ArticleResponseDto } from '../dto/article-response.dto';
import { Query } from '@nestjs/cqrs';

export class GetArticle extends Query<ArticleResponseDto> {
  constructor(public readonly articleId: string) {
    super();
  }
}
