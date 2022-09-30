import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  //设置值的方法
  async set(key: string, value: any, seconds?: number) {
    value = JSON.stringify(value);
    if (!seconds) {
      await this.redis.set(key, value);
    } else {
      await this.redis.set(key, value, 'EX', seconds);
    }
  }

  //获取值的方法
  async get(key: string) {
    const data = await this.redis.get(key);
    if (!data) return;
    return JSON.parse(data);
  }
}
