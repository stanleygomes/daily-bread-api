import { config } from '../../config/index.js';
import { Logger } from '../../logger/pino.logger.js';
import { IAIQueryService } from '../../../domain/port/services/ai-query.service.js';
import { BreadMessage } from '../../../domain/entities/bread-message.entity.js';
import { HttpClient } from '../../http/http-client.js';
import { GroqChatCompletionResponse } from './responses/groq-message.response.js';
import { GroqChatCompletionMessageMapper } from './mappers/groq-message.mapper.js';

const groqConfig = config.services.groq;
const { apiUrl, apiKey, maxTokens } = groqConfig;
const model = groqConfig.models.text;

const http = new HttpClient(apiUrl);

export class GroqService implements IAIQueryService {
  private logger = Logger.getLogger();

  async fetchText(prompt: string): Promise<BreadMessage> {
    const role = 'You are a pastor faithful to God and faithful to what is written in the Bible';

    try {
      const response = await http.post<GroqChatCompletionResponse>(
        '/chat/completions',
        {
          model: model,
          messages: [
            { role: "system", content: role },
            { role: "user", content: JSON.stringify(prompt) }
          ],
          max_completion_tokens: maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return GroqChatCompletionMessageMapper.toEntity(response);
    } catch (error: any) {
      this.logger.error(error)
      throw new Error('Failed to fetch text from groq API');
    }
  }
}
