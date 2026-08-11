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
import { ArticleStatus } from '../article-status.enum';

@Entity('articles')
@Index('IDX_ARTICLE_AUTHOR_STATUS', ['authorId', 'status'])
@Index('IDX_ARTICLE_AUTHOR_STATUS_DATE', ['authorId', 'status', 'createdAt'])
export class ArticleSchema {
  @ObjectIdColumn()
  _id!: ObjectId;

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

  @Column({ default: 1 })
  readTime!: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
