import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateArticle } from '../create-article';
import { Inject } from '@nestjs/common';
import {
  I_ARTICLES_REPOSITORY,
  type IArticlesRepository,
} from 'src/articles/interfaces/article.interface';
import { ArticleEntity } from 'src/articles/article.entity';

@CommandHandler(CreateArticle)
export class CreateArticleHandler implements ICommandHandler<CreateArticle> {
  constructor(
    @Inject(I_ARTICLES_REPOSITORY)
    private readonly _articleRepo: IArticlesRepository,
  ) {}

  async execute(command: CreateArticle): Promise<ArticleEntity> {
    const { author, data } = command;

    return this._articleRepo.create(author.id.toString(), data);
  }
}
