import { Module } from '@nestjs/common';
import { HashService } from '@src/common/modules/hash/hash.service.js';

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
