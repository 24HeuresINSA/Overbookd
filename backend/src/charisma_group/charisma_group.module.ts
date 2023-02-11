import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CharismaGroupController } from './charisma_group.controller';
import { CharismaGroupService } from './charisma_group.service';

@Module({
  controllers: [CharismaGroupController],
  providers: [CharismaGroupService, PrismaService],
})
export class CharismaGroupModule {}
