import { Injectable } from '@nestjs/common';
import { IArticlesRepository } from './interfaces/article.interface';
import {
  PaginationParamsInterface,
  PaginatedResultInterface,
} from 'src/common/common.interfaces';
import { ArticleStatusEnum } from './article-status.enum';
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

@Injectable()
export class ArticlesRepositoryImpl implements IArticlesRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly _articleRepo: MongoRepository<ArticleEntity>,
  ) {}

  async findByAuthorId(
    authorId: string,
    status?: ArticleStatusEnum,
    pagination?: PaginationParamsInterface,
  ): Promise<PaginatedResultInterface<ArticleEntity>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: MongoWhere<ArticleEntity> = {
      authorId: new ObjectId(authorId),
      status: status,
    };

    if (pagination?.search) {
      const regexQuery: IMongoRegex = {
        $regex: pagination.search,
        $options: 'i',
      };
      where.title = regexQuery;
    }

    const sortBy = pagination?.sortBy ?? 'createdAt';
    const sortOrder = pagination?.sortOrder;

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
