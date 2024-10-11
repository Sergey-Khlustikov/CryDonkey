import IORedis, {Redis} from 'ioredis';
import ENV from '../structures/env';

class RedisConnection {
  private readonly connection: Redis;

  constructor() {
    this.connection = new IORedis({
      host: ENV.REDIS_HOST || 'redis',
      port: Number(ENV.REDIS_PORT) || 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  getConnection(): Redis {
    return this.connection;
  }
}

export default new RedisConnection();
