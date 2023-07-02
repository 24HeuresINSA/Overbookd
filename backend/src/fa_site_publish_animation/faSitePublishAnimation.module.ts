import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FaSitePublishAnimationController } from './faSitePublishAnimation.controller';
import { FaSitePublishAnimationService } from './faSitePublishAnimation.service';

@Module({
  controllers: [FaSitePublishAnimationController],
  providers: [FaSitePublishAnimationService, PrismaService],
})
export class FaSitePublishAnimationModule {}
