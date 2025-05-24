const { HUGGING_FACE_ACCESS_TOKEN } = process.env;
const { AIMLAPI_API_KEY } = process.env;

export const config = {
  services: {
    huggingface: {
      apiUrl: 'https://api-inference.huggingface.co/models/',
      models: {
        text: "",
      },
      accessToken: HUGGING_FACE_ACCESS_TOKEN,
    },
    aimlapi: {
      apiUrl: 'https://api.aimlapi.com/v1/completions',
      apiKey: AIMLAPI_API_KEY,
      models: {
        text: 'gpt-4o-mini',
      },
    },
  },
};
