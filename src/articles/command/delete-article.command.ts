import { Command } from '@nestjs/cqrs';

export class DeleteArticleCommand extends Command<void> {
  constructor(public readonly articleId: string) {
    super();
  }
}
