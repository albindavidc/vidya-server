import { Injectable } from '@nestjs/common';
import { IArticlesRepository } from './interfaces/article.interface';
import {
  PaginationParamsInterface,
  PaginatedResultInterface,
} from 'src/common/common.interfaces';
import { ArticleStatus } from './article-status.enum';
import { ArticleEntity } from './domain/article.entity';
import { ArticleSchema } from './schemas/article.schema';
import { FindOptionsWhere, FindOperator, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleMapper } from './mappers/article.mapper';

export interface IMongoRegex {
  $regex: string;
  $options: string;
}

export type MongoWhere<T> = Omit<FindOptionsWhere<T>, keyof T> & {
  [P in keyof T]?: T[P] | FindOperator<T[P]> | IMongoRegex;
};

@Injectable()
export class ArticlesRepositoryImpl implements IArticlesRepository {
  constructor(
    @InjectRepository(ArticleSchema)
    private readonly _articleRepo: MongoRepository<ArticleSchema>,
    private readonly _articleMapper: ArticleMapper,
  ) {}

  async save(article: ArticleEntity): Promise<ArticleEntity> {
    const persistenceEntity = this._articleMapper.toPersistence(article);
    const entity = this._articleRepo.create(persistenceEntity);
    const saved = await this._articleRepo.save(entity);
    return this._articleMapper.toDomain(saved) as ArticleEntity;
  }

  async findById(articleId: string): Promise<ArticleEntity | null> {
    const raw = await this._articleRepo.findOne({
      where: { _id: new ObjectId(articleId) },
    });
    return this._articleMapper.toDomain(raw);
  }

  async delete(articleId: string): Promise<void> {
    await this._articleRepo.delete(articleId);
  }

  async findByAuthorId(
    authorId?: string,
    status?: ArticleStatus,
    pagination?: PaginationParamsInterface,
  ): Promise<PaginatedResultInterface<ArticleEntity>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: MongoWhere<ArticleSchema> = {};

    if (authorId) {
      where.authorId = new ObjectId(authorId);
    }

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
      data: data.map((d) => this._articleMapper.toDomain(d) as ArticleEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
