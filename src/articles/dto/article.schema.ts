import z from 'zod';
import { ArticleStatus } from '../article-status.enum';
import { PaginationParamsSchema } from 'src/common/dto/pagination.schema';

export const ArticleSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().min(1, { message: 'Content is required' }),

  status: z.nativeEnum(ArticleStatus).default(ArticleStatus.DRAFT),
  authorId: z.string().min(1, { message: 'AuthorId is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),

  readTime: z.number().default(1),
});

export const CreateArticleSchema = ArticleSchema.omit({
  authorId: true,
}).extend({
  slug: z.string().optional(),
});
export const UpdateArticleSchema = ArticleSchema.partial();

export const GetArticleRequestSchema = z
  .object({
    status: z.nativeEnum(ArticleStatus).optional(),
    scope: z.enum(['all', 'mine']).optional(),
    authorId: z.string().optional(),
  })
  .merge(PaginationParamsSchema);

export type GetArticleRequestDto = z.infer<typeof GetArticleRequestSchema>;

export const AiSummaryRequestSchema = z.object({
  content: z.string().min(1, { message: 'Content is required for AI summary' }),
});
export type AiSummaryRequestDto = z.infer<typeof AiSummaryRequestSchema>;

export type CreateArticleDto = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleDto = z.infer<typeof UpdateArticleSchema>;
