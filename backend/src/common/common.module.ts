import { Module } from '@nestjs/common';
import { SlugifyService } from './services/slugify.service';

@Module({
  providers: [SlugifyService],
  exports: [SlugifyService],
})
export class CommonModule {}
