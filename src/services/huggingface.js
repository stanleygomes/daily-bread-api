// import axios from 'axios';
import { InferenceClient } from "@huggingface/inference";

import { logger } from '@/utils/logger';
import { config } from '@/config/config';

const token = config.services.huggingface.accessToken;

export const fetchText = async (prompt) => {
  const model = config.services.huggingface.models.text;
  return fetch(model, prompt);
};

const fetch = async (model, prompt) => {
  try {
    if (!model) {
      throw new Error('Model not specified in the configuration');
    }

    const client = new InferenceClient(token);
    const text = await client.textGeneration({
        provider: "novita",
        model: "gpt-3.5-turbo",
        inputs: prompt,
    })

    return text.choices[0].message;

    // const url = `${config.services.huggingface.apiUrl}${model}`;
    // const response = await axios.post(
    //   url,
    //   {
    //     inputs: prompt,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    // return response.data[0].generated_text;
  } catch (error) {
    logger.error('Error fetching text from Hugging Face:', error);
    throw new Error('Failed to fetch text from Hugging Face API');
  }
};
