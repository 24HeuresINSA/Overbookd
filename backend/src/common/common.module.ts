import { Module } from '@nestjs/common';
import { StatsService } from './services/stats.service';
import { SlugifyService } from './services/slugify.service';
import { GroupByService } from './services/group-by.service';

@Module({
  providers: [SlugifyService, GroupByService, StatsService],
  exports: [SlugifyService, GroupByService, StatsService],
})
export class CommonModule {}
