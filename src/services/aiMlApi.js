import { logger } from '@/utils/logger';
import { config } from '@/config/config';
import { OpenAI } from 'openai';

const apiUrl = config.services.aimlapi.apiUrl;
const apiKey = config.services.aimlapi.apiKey;
const model = config.services.aimlapi.models.text;

const api = new OpenAI({
  apiKey,
  baseURL: apiUrl,
});

export const fetchText = async (prompt) => {
  const role = 'You are a pastor faithful to God and faithful to what is written in the Bible';
  return fetch(prompt, role);
};

const fetch = async (prompt, role) => {
  try {

    const completion = await api.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: role,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    logger.info('Response from aimlapi.com:', completion);

    return completion.choices[0].message.content
  } catch (error) {
    logger.error('Error fetching text from aimlapi.com:', error);
    throw new Error('Failed to fetch text from aimlapi.com API');
  }
};
