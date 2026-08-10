import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteArticleCommand } from '../delete-article.command';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  I_ARTICLES_REPOSITORY,
  type IArticlesRepository,
} from '../../interfaces/article.interface';

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleHandler implements ICommandHandler<DeleteArticleCommand> {
  constructor(
    @Inject(I_ARTICLES_REPOSITORY)
    private readonly _articleRepo: IArticlesRepository,
  ) {}

  async execute(command: DeleteArticleCommand): Promise<void> {
    const article = await this._articleRepo.findById(command.articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this._articleRepo.delete(command.articleId);
  }
}
