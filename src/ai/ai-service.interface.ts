export const AI_SERVICE_TOKEN = Symbol('IAiService');

export interface IAiService {
  generateSummary(content: string): Promise<string>;
}
