import axios from 'axios';
import { config } from '../config/config';
import { logger } from '../utils/logger';

const { apiUrl, apiKey, maxTokens } = config.services.aimlapi;
const model = config.services.aimlapi.models.text;

export const fetchText = async (prompt) => {
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
  } catch (error) {
    logger.error(error);
    throw new Error('Failed to fetch text from aimlapi.com API');
  }
};
