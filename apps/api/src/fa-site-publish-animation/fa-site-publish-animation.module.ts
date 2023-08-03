import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FaSitePublishAnimationController } from './fa-site-publish-animation.controller';
import { FaSitePublishAnimationService } from './fa-site-publish-animation.service';

@Module({
  controllers: [FaSitePublishAnimationController],
  providers: [FaSitePublishAnimationService, PrismaService],
})
export class FaSitePublishAnimationModule {}
