import { Module } from '@nestjs/common';

import { AI_SERVICE_TOKEN } from './ai-service.interface';
import { AiService } from './ai.service';

@Module({
  providers: [
    {
      provide: AI_SERVICE_TOKEN,
      useClass: AiService,
    },
  ],
  exports: [AI_SERVICE_TOKEN],
})
export class AiModule {}
