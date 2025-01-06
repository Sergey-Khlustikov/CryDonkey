const ENV = {
  ENVIRONMENT: process.env.ENVIRONMENT || 'dev',
  JWT_SECRET: process.env.JWT_SECRET || 'secretJwt',

  EXPRESS_SERVER_PORT: process.env.EXPRESS_SERVER_PORT,

  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_PORT_LOCAL: process.env.DB_PORT_LOCAL,
  DB_DATA_PATH: process.env.DB_DATA_PATH,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PORT_LOCAL: process.env.REDIS_PORT_LOCAL,
  REDIS_DATA_PATH: process.env.REDIS_DATA_PATH,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  RABBY_PASSWORD: process.env.RABBY_PASSWORD || '',
};

export default ENV;
