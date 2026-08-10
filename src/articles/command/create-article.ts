import { ICommand } from '@nestjs/cqrs';
import { CreateArticleDto } from '../dto/article.schema';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateArticle implements ICommand {
  constructor(
    public readonly data: CreateArticleDto,
    public readonly author: UserEntity,
  ) {}
}
