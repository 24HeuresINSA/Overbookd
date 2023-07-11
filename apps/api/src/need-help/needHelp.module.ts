import { Module } from '@nestjs/common';
import { PrismaService } from '../../src/prisma.service';
import { NeedHelpController } from './needHelp.controller';
import { PrismaVolunteerRepository } from './volunteer.repository.prisma';
import { NeedHelpService } from './needHelp.service';
import { CommonModule } from '../../src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [NeedHelpController],
  providers: [
    PrismaService,
    NeedHelpService,
    { provide: 'VOLUNTEER_REPOSITORY', useClass: PrismaVolunteerRepository },
  ],
  exports: [NeedHelpService],
})
export class NeedHelpModule {}
