// src/articles/entities/article.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { ArticleStatus } from './article-status.enum';

@Entity('articles')
@Index('IDX_ARTICLE_AUTHOR_STATUS', ['authorId', 'status'])
@Index('IDX_ARTICLE_AUTHOR_STATUS_DATE', ['authorId', 'status', 'createdAt'])
export class ArticleEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  content!: string;

  @Column({ nullable: true })
  summary?: string;

  @Index('IDX_ARTICLE_STATUS')
  @Column({
    default: ArticleStatus.DRAFT,
  })
  status!: ArticleStatus;

  @Index('IDX_ARTICLE_AUTHOR')
  @Column()
  authorId!: ObjectId;

  @Index({
    unique: true,
  })
  @Column()
  slug!: string;

  @Column({ default: 0 })
  viewCount!: number;

  @Column({ default: 1 })
  readTime!: number;

  @Column({ default: [] })
  coverImages!: string[];

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Domain Logic & Business Rules
  static create(
    authorId: ObjectId,
    title: string,
    content: string,
    partial?: Partial<ArticleEntity>,
  ): ArticleEntity {
    if (!title || !content) {
      throw new Error('Title and content are required to create an article.');
    }
    const article = new ArticleEntity();
    article.authorId = authorId;
    article.title = title;
    article.content = content;
    article.status = ArticleStatus.DRAFT;
    article.coverImages = [];
    article.viewCount = 0;
    article.readTime = 1;

    if (partial) {
      Object.assign(article, partial);
    }

    return article;
  }

  updateDetails(data: Partial<ArticleEntity>) {
    if (
      data.authorId &&
      data.authorId.toString() !== this.authorId.toString()
    ) {
      throw new Error('Cannot change the author of an existing article.');
    }

    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.content !== undefined) this.content = data.content;
    if (data.summary !== undefined) this.summary = data.summary;
    if (data.coverImages !== undefined) this.coverImages = data.coverImages;
    if (data.slug !== undefined) this.slug = data.slug;
    if (data.status !== undefined) this.status = data.status;
  }
}
