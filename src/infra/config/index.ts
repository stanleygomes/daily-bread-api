const {
  MONGODB_URI,
  MONGODB_DATABASE,
  APP_CORS_ORIGIN,
  NODE_ENV,
  AIMLAPI_API_KEY,
  GROQ_API_KEY,
  RESEND_API_KEY,
  RESEND_EMAIL_TO,
} = process.env;

export interface Config {
  app: {
    cors: {
      allowedOrigin: string;
      allowedMethods: string;
      allowedHeaders: string;
    };
    env?: string;
  };
  databases: {
    mongodb: {
      uri?: string;
      dbName?: string;
    };
  };
  services: {
    aimlapi: {
      apiUrl: string;
      apiKey?: string;
      models: {
        text: string;
      };
      maxTokens: number;
    };
    groq: {
      apiUrl: string;
      apiKey?: string;
      models: {
        text: string;
      };
      maxTokens: number;
    };
    resend: {
      apiUrl: string;
      apiKey?: string;
      emailFrom?: string;
      emailTo?: string;
    };
  };
}

export const config: Config = {
  app: {
    cors: {
      allowedOrigin: APP_CORS_ORIGIN || '*localhost*',
      allowedMethods: "GET,POST,PUT,DELETE,OPTIONS",
      allowedHeaders: "Content-Type,Authorization",
    },
    env: NODE_ENV,
  },
  databases: {
    mongodb: {
      uri: MONGODB_URI || 'mongodb://jhon-the-baptist:ABC123@localhost:27017/',
      dbName: MONGODB_DATABASE || 'daily-bread',
    },
  },
  services: {
    aimlapi: {
      apiUrl: 'https://api.aimlapi.com',
      apiKey: AIMLAPI_API_KEY,
      models: {
        text: "gpt-3.5-turbo",
      },
      maxTokens: 100,
    },
    groq: {
      apiUrl: 'https://api.groq.com/openai/v1',
      apiKey: GROQ_API_KEY,
      models: {
        text: "llama3-70b-8192",
      },
      maxTokens: 1024,
    },
    resend: {
      apiUrl: 'https://api.resend.com/v1/send',
      apiKey: RESEND_API_KEY,
      emailTo: RESEND_EMAIL_TO,
      emailFrom: 'DailyBread <onboarding@resend.dev>',
    },
  }
};
