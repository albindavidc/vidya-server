import { Command } from '@nestjs/cqrs';
import { UpdateArticleDto } from '../dto/article.schema';
import { ArticleResponseDto } from '../dto/article-response.dto';

export class UpdateArticleCommand extends Command<ArticleResponseDto> {
  constructor(
    public readonly articleid: string,
    public readonly data: UpdateArticleDto,
  ) {
    super();
  }
}
