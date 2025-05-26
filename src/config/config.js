const {
  HUGGING_FACE_ACCESS_TOKEN,
  AIMLAPI_API_KEY,
  MONGODB_DATABASE,
  MONGODB_URI,
  RESEND_API_KEY,
  RESEND_EMAIL_TO,
} = process.env;

export const config = {
  databases: {
    mongodb: {
      uri: MONGODB_URI || 'mongodb://jhon-the-baptist:ABC123@localhost:27017/',
      dbName: MONGODB_DATABASE || 'daily-bread',
    },
  },
  services: {
    huggingface: {
      apiUrl: 'https://api-inference.huggingface.co/models/',
      models: {
        text: "",
      },
      accessToken: HUGGING_FACE_ACCESS_TOKEN,
    },
    aimlapi: {
      apiUrl: 'https://api.aimlapi.com/v1/chat/completions',
      apiKey: AIMLAPI_API_KEY,
      models: {
        text: 'gpt-4o-mini',
      },
      maxTokens: 1500,
    },
    resend: {
      apiUrl: 'https://api.resend.com/emails',
      apiKey: RESEND_API_KEY,
      emailTo: RESEND_EMAIL_TO,
    },
  },
};
