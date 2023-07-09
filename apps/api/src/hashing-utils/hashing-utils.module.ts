import { Module } from '@nestjs/common';
import { HashingUtilsService } from './hashing-utils.service';

@Module({
  providers: [HashingUtilsService],
  exports: [HashingUtilsService],
})
export class HashingUtilsModule {}
