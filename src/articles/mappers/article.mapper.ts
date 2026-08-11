import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ArticleEntity } from '../domain/article.entity';
import { ArticleSchema } from '../schemas/article.schema';
import { ArticleResponseDto } from '../dto/article-response.dto';

type RawDocument<T> = Partial<T> & { _id?: ObjectId };

@Injectable()
export class ArticleMapper {
  toPersistence(
    entity: ArticleEntity,
  ): Omit<ArticleSchema, '_id'> & { _id?: ObjectId } {
    return {
      _id: entity.id ? new ObjectId(entity.id) : undefined,
      title: entity.title,
      description: entity.description,
      content: entity.content,
      summary: entity.summary,
      status: entity.status,
      authorId: new ObjectId(entity.authorId),
      slug: entity.slug,

      readTime: entity.readTime,

      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(raw: RawDocument<ArticleSchema> | null): ArticleEntity | null {
    if (!raw) return null;
    return ArticleEntity.fromPersistence({
      id: raw._id ? raw._id.toString() : '',
      title: raw.title!,
      description: raw.description,
      content: raw.content!,
      summary: raw.summary,
      status: raw.status!,
      authorId: raw.authorId!.toString(),
      slug: raw.slug!,

      readTime: raw.readTime!,

      deletedAt: raw.deletedAt,
      createdAt: raw.createdAt!,
      updatedAt: raw.updatedAt!,
    });
  }

  toResponse(article: ArticleEntity): ArticleResponseDto {
    return {
      id: article.id.toString(),
      title: article.title,
      description: article.description,
      summary: article.summary,
      content: article.content,

      status: article.status,
      authorId: article.authorId.toString(),
      slug: article.slug,

      readTime: article.readTime,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
}
