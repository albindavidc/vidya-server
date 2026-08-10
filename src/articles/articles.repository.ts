import { Injectable, NotFoundException } from '@nestjs/common';
import { IArticlesRepository } from './interfaces/article.interface';
import {
  PaginationParamsInterface,
  PaginatedResultInterface,
} from 'src/common/common.interfaces';
import { ArticleStatus } from './article-status.enum';
import { ArticleEntity } from './article.entity';
import { FindOptionsWhere, FindOperator, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

export interface IMongoRegex {
  $regex: string;
  $options: string;
}

export type MongoWhere<T> = Omit<FindOptionsWhere<T>, keyof T> & {
  [P in keyof T]?: T[P] | FindOperator<T[P]> | IMongoRegex;
};

import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.schema';

@Injectable()
export class ArticlesRepositoryImpl implements IArticlesRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly _articleRepo: MongoRepository<ArticleEntity>,
  ) {}

  async create(
    authorId: string,
    data: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = this._articleRepo.create({
      ...data,
      authorId: new ObjectId(authorId),
    });
    return this._articleRepo.save(article);
  }

  async findById(articleId: string): Promise<ArticleEntity | null> {
    return this._articleRepo.findOne({
      where: { _id: new ObjectId(articleId) },
    });
  }

  async update(
    articleId: string,
    data: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    await this._articleRepo.update(articleId, data);
    return article;
  }

  async delete(articleId: string): Promise<ArticleEntity> {
    const article = await this.findById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    await this._articleRepo.delete(articleId);
    return article;
  }

  async findByAuthorId(
    authorId: string,
    status?: ArticleStatus,
    pagination?: PaginationParamsInterface,
  ): Promise<PaginatedResultInterface<ArticleEntity>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: MongoWhere<ArticleEntity> = {
      authorId: new ObjectId(authorId),
    };

    if (status) {
      where.status = status;
    }

    if (pagination?.search) {
      const regexQuery: IMongoRegex = {
        $regex: pagination.search,
        $options: 'i',
      };
      where.title = regexQuery;
    }

    const sortBy = pagination?.sortBy ?? 'createdAt';
    const sortOrder = pagination?.sortOrder === 'asc' ? 'ASC' : 'DESC';

    const [data, total] = await this._articleRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
