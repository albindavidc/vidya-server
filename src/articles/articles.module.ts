import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { ArticlesRepositoryImpl } from './articles.repository';
import { I_ARTICLES_REPOSITORY } from './interfaces/article.interface';
import { ArticleQueryHandler } from './article-query.handler';
import { ArticleMapper } from './mappers/article.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  providers: [
    {
      provide: I_ARTICLES_REPOSITORY,
      useClass: ArticlesRepositoryImpl,
    },
    ArticleQueryHandler,
    ArticleMapper,
  ],
  exports: [I_ARTICLES_REPOSITORY],
})
export class ArticlesModule {}
