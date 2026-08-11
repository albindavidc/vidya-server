import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateArticleCommand } from '../create-article.command';
import { Inject } from '@nestjs/common';
import {
  I_ARTICLES_REPOSITORY,
  type IArticlesRepository,
} from '../../interfaces/article.interface';
import { ArticleMapper } from '../../mappers/article.mapper';
import { ArticleResponseDto } from '../../dto/article-response.dto';
import { ArticleEntity } from '../../domain/article.entity';

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler implements ICommandHandler<CreateArticleCommand> {
  constructor(
    @Inject(I_ARTICLES_REPOSITORY)
    private readonly _articleRepo: IArticlesRepository,
    private readonly _articleMapper: ArticleMapper,
  ) {}

  async execute(command: CreateArticleCommand): Promise<ArticleResponseDto> {
    const { authorId, data } = command;

    const article = ArticleEntity.create({
      authorId: authorId,
      title: data.title,
      content: data.content,
      description: data.description,
      summary: data.summary,

      slug:
        data.slug ||
        data.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
      status: data.status,
      readTime: data.readTime,
    });
    const savedArticle = await this._articleRepo.save(article);

    return this._articleMapper.toResponse(savedArticle);
  }
}
