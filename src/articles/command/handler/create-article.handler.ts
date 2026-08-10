import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateArticleCommand } from '../create-article.command';
import { Inject } from '@nestjs/common';
import {
  I_ARTICLES_REPOSITORY,
  type IArticlesRepository,
} from '../../interfaces/article.interface';
import { ArticleMapper } from '../../mappers/article.mapper';
import { ArticleResponseDto } from '../../dto/article-response.dto';
import { ArticleEntity } from '../../article.entity';

import { ObjectId } from 'mongodb';

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler implements ICommandHandler<CreateArticleCommand> {
  constructor(
    @Inject(I_ARTICLES_REPOSITORY)
    private readonly _articleRepo: IArticlesRepository,
    private readonly _articleMapper: ArticleMapper,
  ) {}

  async execute(command: CreateArticleCommand): Promise<ArticleResponseDto> {
    const { authorId, data } = command;

    const article = ArticleEntity.create(
      new ObjectId(authorId),
      data.title,
      data.content,
      {
        description: data.description,
        summary: data.summary,
        coverImages: data.coverImages,
        slug: data.slug,
        status: data.status,
        viewCount: data.viewCount,
        readTime: data.readTime,
      },
    );
    const savedArticle = await this._articleRepo.save(article);

    return this._articleMapper.toResponseDto(savedArticle);
  }
}
