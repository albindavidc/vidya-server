import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Request,
  UseGuards,
  UsePipes,
  Delete,
  Param,
  Post,
  Put,
  Body,
  Inject,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  type CreateArticleDto,
  CreateArticleSchema,
  type GetArticleRequestDto,
  GetArticleRequestSchema,
  type UpdateArticleDto,
  UpdateArticleSchema,
  AiSummaryRequestSchema,
  type AiSummaryRequestDto,
} from './dto/article.schema';
import { ArticleResponseDto } from './dto/article-response.dto';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ArticleQuery } from './query/article.query';
import { CreateArticleCommand } from './command/create-article.command';
import { UpdateArticleCommand } from './command/update-article.command';
import { DeleteArticleCommand } from './command/delete-article.command';
import type { RequestWithUser } from 'src/auth/interfaces/auth.interfaces';
import { API_ROUTES } from 'src/common/constants/api-routes.constant';
import { AI_SERVICE_TOKEN, type IAiService } from 'src/ai/ai-service.interface';
import { GetArticle } from './query/get-article.query';
import { ArticleStatus } from './article-status.enum';

@Controller(API_ROUTES.ARTICLES.ROOT)
export class ArticlesController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @Inject(AI_SERVICE_TOKEN) private readonly _aiService: IAiService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ZodValidationPipe<GetArticleRequestDto>(GetArticleRequestSchema),
  )
  @UseGuards(JwtAuthGuard)
  async getArticles(
    @Request() req: RequestWithUser,
    @Query() queryDto: GetArticleRequestDto,
  ) {
    const isMine = queryDto.scope === 'mine';
    const targetAuthorId = isMine ? req.user.userId : queryDto.authorId;

    const targetStatus = queryDto.status
      ? queryDto.status
      : isMine
        ? undefined
        : ArticleStatus.PUBLISHED;

    return this._queryBus.execute(
      new ArticleQuery(targetAuthorId, targetStatus, queryDto),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getArticleById(
    @Param(API_ROUTES.ARTICLES.PARAM_ID) id: string,
  ): Promise<ArticleResponseDto> {
    return this._queryBus.execute(new GetArticle(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe<CreateArticleDto>(CreateArticleSchema))
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Request() req: RequestWithUser,
    @Body() bodyDto: CreateArticleDto,
  ): Promise<ArticleResponseDto> {
    return this._commandBus.execute(
      new CreateArticleCommand(req.user.userId, bodyDto),
    );
  }

  @Post('ai/summary')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe<AiSummaryRequestDto>(AiSummaryRequestSchema))
  @UseGuards(JwtAuthGuard)
  async generateAiSummary(
    @Body() bodyDto: AiSummaryRequestDto,
  ): Promise<{ summary: string }> {
    const summary = await this._aiService.generateSummary(bodyDto.content);
    return { summary };
  }

  @Put(API_ROUTES.ARTICLES.UPDATE)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe<UpdateArticleDto>(UpdateArticleSchema))
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Param(API_ROUTES.ARTICLES.PARAM_ID) id: string,
    @Body() bodyDto: UpdateArticleDto,
  ): Promise<ArticleResponseDto> {
    return this._commandBus.execute(new UpdateArticleCommand(id, bodyDto));
  }

  @Delete(API_ROUTES.ARTICLES.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Param(API_ROUTES.ARTICLES.PARAM_ID) id: string,
  ): Promise<void> {
    await this._commandBus.execute(new DeleteArticleCommand(id));
  }
}
