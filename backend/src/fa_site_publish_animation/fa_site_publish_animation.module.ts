import { Module } from '@nestjs/common';
import { FaSitePublishAnimationService } from './fa_site_publish_animation.service';
import { FaSitePublishAnimationController } from './fa_site_publish_animation.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FaSitePublishAnimationController],
  providers: [FaSitePublishAnimationService, PrismaService],
})
export class FaSitePublishAnimationModule {}
