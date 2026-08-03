import { ArticleStatus } from '../article-status.enum';

export type ArticleResponseDto = {
  id: string;
  title: string;
  description?: string;
  content: string;
  coverImages?: string[];
  status: ArticleStatus;
  authorId: string;
  slug: string;
  viewCount: number;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
};
