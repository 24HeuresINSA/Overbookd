import { Module } from '@nestjs/common';
import { SecurityPassService } from './security_pass.service';
import { SecurityPassController } from './security_pass.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SecurityPassController],
  providers: [SecurityPassService, PrismaService],
})
export class SecurityPassModule {}
