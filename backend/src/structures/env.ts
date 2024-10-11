const ENV = {
  EXPRESS_SERVER_PORT: process.env.EXPRESS_SERVER_PORT,

  ADS_HOST: process.env.ADS_HOST,
  ADS_API_URL: process.env.ADS_API_URL,

  ATLAS_URI: process.env.ATLAS_URI,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_PORT_LOCAL: process.env.DB_PORT_LOCAL,

  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,

  RABBY_PASSWORD: process.env.RABBY_PASSWORD,
};

export default ENV;
