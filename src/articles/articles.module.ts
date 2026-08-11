import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleSchema } from './schemas/article.schema';
import { ArticlesRepositoryImpl } from './articles.repository';
import { I_ARTICLES_REPOSITORY } from './interfaces/article.interface';
import { ArticleQueryHandler } from './query/handler/article-query.handler';
import { ArticleMapper } from './mappers/article.mapper';
import { ArticlesController } from './articles.controller';
import { CreateArticleHandler } from './command/handler/create-article.handler';
import { UpdateArticleHandler } from './command/handler/update-article.handler';
import { DeleteArticleHandler } from './command/handler/delete-article.handler';
import { GetArticlesHandler } from './query/handler/get-article.handler';

import { CqrsModule } from '@nestjs/cqrs';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleSchema]), CqrsModule, AiModule],
  providers: [
    {
      provide: I_ARTICLES_REPOSITORY,
      useClass: ArticlesRepositoryImpl,
    },
    ArticleQueryHandler,
    GetArticlesHandler,
    CreateArticleHandler,
    UpdateArticleHandler,
    DeleteArticleHandler,
    ArticleMapper,
  ],
  exports: [I_ARTICLES_REPOSITORY],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
