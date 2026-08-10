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
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  type CreateArticleDto,
  ArticleSchema,
  type GetArticleRequestDto,
  GetArticleRequestSchema,
  type UpdateArticleDto,
  UpdateArticleSchema,
} from './dto/article.schema';
import { ArticleResponseDto } from './dto/article-response.dto';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ArticleQuery } from './query/article.query';
import { CreateArticleCommand } from './command/create-article.command';
import { UpdateArticleCommand } from './command/update-article.command';
import { DeleteArticleCommand } from './command/delete-article.command';
import type { RequestWithUser } from 'src/auth/interfaces/auth.interfaces';
import { API_ROUTES } from 'src/common/constants/api-routes.constant';

@Controller(API_ROUTES.ARTICLES.ROOT)
export class ArticlesController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
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
    return this._queryBus.execute(
      new ArticleQuery(req.user.userId, queryDto.status, queryDto),
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe<CreateArticleDto>(ArticleSchema))
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Request() req: RequestWithUser,
    @Body() bodyDto: CreateArticleDto,
  ): Promise<ArticleResponseDto> {
    return this._commandBus.execute(
      new CreateArticleCommand(req.user.userId, bodyDto),
    );
  }

  @Put(API_ROUTES.ARTICLES.UPDATE)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe<UpdateArticleDto>(UpdateArticleSchema))
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Param(API_ROUTES.ARTICLES.UPDATE) id: string,
    @Body() bodyDto: UpdateArticleDto,
  ): Promise<ArticleResponseDto> {
    return this._commandBus.execute(new UpdateArticleCommand(id, bodyDto));
  }

  @Delete(API_ROUTES.ARTICLES.DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Param(API_ROUTES.ARTICLES.DELETE) id: string,
  ): Promise<void> {
    await this._commandBus.execute(new DeleteArticleCommand(id));
  }
}
