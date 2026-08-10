import { Injectable } from '@nestjs/common';
import { ArticleEntity } from '../article.entity';
import { ArticleResponseDto } from '../dto/article-response.dto';

@Injectable()
export class ArticleMapper {
  toResponseDto(article: ArticleEntity): ArticleResponseDto {
    return {
      id: article.id.toString(),
      title: article.title,
      description: article.description,
      summary: article.summary,
      content: article.content,
      coverImages: article.coverImages,
      status: article.status,
      authorId: article.authorId.toString(),
      slug: article.slug,
      viewCount: article.viewCount,
      readTime: article.readTime,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
}
