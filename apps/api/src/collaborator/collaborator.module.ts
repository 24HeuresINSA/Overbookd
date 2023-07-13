import { Module } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CollaboratorController } from './collaborator.controller';
import { PrismaService } from '../prisma.service';
import { FaService } from '../fa/fa.service';
import { StatsService } from '../common/services/stats.service';

@Module({
  controllers: [CollaboratorController],
  providers: [CollaboratorService, PrismaService, FaService, StatsService],
})
export class CollaboratorModule {}
