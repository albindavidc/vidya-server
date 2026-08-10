import { ICommand } from '@nestjs/cqrs';
import { UpdateArticleDto } from '../dto/article.schema';

export class UpdateArticleCommand implements ICommand {
  constructor(
    public readonly articleid: string,
    public readonly data: UpdateArticleDto,
  ) {}
}
