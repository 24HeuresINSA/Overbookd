import { Module } from '@nestjs/common';
import { StatsService } from './services/stats.service';
import { SlugifyService } from './services/slugify.service';

@Module({
  providers: [SlugifyService, StatsService],
  exports: [SlugifyService, StatsService],
})
export class CommonModule {}
