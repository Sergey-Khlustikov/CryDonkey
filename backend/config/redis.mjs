import IORedis from 'ioredis';
import ENV from '../structures/env.mjs';

class RedisConnection {
  constructor() {
    this.connection = new IORedis({
      host: ENV.REDIS_HOST || 'redis',
      port: ENV.REDIS_PORT || 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  getConnection() {
    return this.connection;
  }
}

export default new RedisConnection();
