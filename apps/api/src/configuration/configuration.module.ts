import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ConfigurationController],
  providers: [ConfigurationService, PrismaService],
})
export class ConfigurationModule {}
