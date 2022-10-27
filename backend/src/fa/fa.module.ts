import { Module } from '@nestjs/common';
import { FaService } from './fa.service';
import { FaController } from './fa.controller';

@Module({
  controllers: [FaController],
  providers: [FaService],
})
export class FaModule {}
