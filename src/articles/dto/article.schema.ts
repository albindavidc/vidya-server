import z from 'zod';
import { ArticleStatusEnum } from '../article-status.enum';
import { PaginationParamsSchema } from 'src/common/dto/pagination.schema';

export const ArticleSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  content: z.string().min(1, { message: 'Content is required' }),
  coverImages: z.array(z.string()).optional(),
  status: z.nativeEnum(ArticleStatusEnum).default(ArticleStatusEnum.DRAFT),
  authorId: z.string().min(1, { message: 'AuthorId is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  viewCount: z.number().default(0),
  readTime: z.number().default(1),
});
export const UpdateArticleSchema = ArticleSchema.partial();

export const GetArticleRequestSchema = z
  .object({
    status: z.nativeEnum(ArticleStatusEnum).optional(),
  })
  .merge(PaginationParamsSchema);

export type GetArticleRequestDto = z.infer<typeof GetArticleRequestSchema>;

export type CreateArticleDto = z.infer<typeof ArticleSchema>;
export type UpdateArticleDto = z.infer<typeof UpdateArticleSchema>;
