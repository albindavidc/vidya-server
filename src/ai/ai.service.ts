import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IAiService } from './ai-service.interface';

@Injectable()
export class AiService implements IAiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing in environment variables');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateSummary(content: string): Promise<string> {
    try {
      this.logger.log('Generating AI summary via Gemini... ');

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert technical editor. Summarize the following article in to 2 to 3 concise, engagint sentences suitable for a blog preview: \n\n ${content}`,
      });

      return response.text?.trim() || '';
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Failed to generate summary', error.stack);
      } else {
        this.logger.error('Failed to generate summary', String(error));
      }
      throw new Error('Failed to generate summary. Please try again later.');
    }
  }
}
