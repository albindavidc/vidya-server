import { Command } from '@nestjs/cqrs';
import { CreateArticleDto } from '../dto/article.schema';
import { ArticleResponseDto } from '../dto/article-response.dto';

export class CreateArticleCommand extends Command<ArticleResponseDto> {
  constructor(
    public readonly authorId: string,
    public readonly data: CreateArticleDto,
  ) {
    super();
  }
}
