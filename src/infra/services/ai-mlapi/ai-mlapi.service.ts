import axios from 'axios';
import { config } from '../../config/index.js';
import { Logger } from '../../logger/pino.logger.js';
import { IAIQueryService } from '../../../domain/port/services/ai-query.service.js';

const { apiUrl, apiKey, maxTokens } = config.services.aimlapi;
const model = config.services.aimlapi.models.text;

export class AiMlApiService implements IAIQueryService {
  private logger = Logger.getLogger();

  async fetchText(prompt: string): Promise<string> {
    const role = 'You are a pastor faithful to God and faithful to what is written in the Bible';
    try {
      const response = await axios.post(
        apiUrl,
        {
          model: model,
          messages: [
            { role: "system", content: role },
            { role: "user", content: prompt }
          ],
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices?.[0]?.message?.content || response.data;
    } catch (error: any) {
      this.logger.error('Error fetching text from aimlapi.com:', error.response?.data || error.message);
      throw new Error('Failed to fetch text from aimlapi.com API');
    }
  }
}
