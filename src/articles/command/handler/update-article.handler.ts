import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateArticleCommand } from '../update-article.command';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  I_ARTICLES_REPOSITORY,
  type IArticlesRepository,
} from '../../interfaces/article.interface';
import { ArticleMapper } from '../../mappers/article.mapper';
import { ArticleResponseDto } from '../../dto/article-response.dto';

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleHandler implements ICommandHandler<UpdateArticleCommand> {
  constructor(
    @Inject(I_ARTICLES_REPOSITORY)
    private readonly _articleRepo: IArticlesRepository,
    private readonly _articleMapper: ArticleMapper,
  ) {}

  async execute(command: UpdateArticleCommand): Promise<ArticleResponseDto> {
    const { articleid, data } = command;

    const article = await this._articleRepo.findById(articleid);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article.updateDetails({
      title: data.title,
      description: data.description,
      summary: data.summary,
      content: data.content,

      status: data.status,
      slug: data.slug,
    });
    const updatedArticle = await this._articleRepo.save(article);

    return this._articleMapper.toResponse(updatedArticle);
  }
}
