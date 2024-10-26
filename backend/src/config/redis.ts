import {Redis, RedisOptions} from "ioredis"
import ENV from '#src/structures/env.js';

export class RedisConnection {
  private readonly connection: Redis;

  constructor() {
    const options: RedisOptions = {
      host: ENV.REDIS_HOST || 'redis',
      port: Number(ENV.REDIS_PORT) || 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };

    this.connection = new Redis(options);
  }

  getConnection(): Redis {
    return this.connection;
  }
}

export default new RedisConnection();
