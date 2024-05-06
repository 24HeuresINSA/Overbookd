import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { NeedHelpController } from "./need-help.controller";
import { PrismaHelpingVolunteers } from "./volunteer.repository.prisma";
import { NeedHelpService } from "./need-help.service";
import { PrismaModule } from "../prisma.module";

@Module({
  controllers: [NeedHelpController],
  providers: [
    {
      provide: PrismaHelpingVolunteers,
      useFactory: (prisma: PrismaService) =>
        new PrismaHelpingVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: NeedHelpService,
      useFactory: (volunteers: PrismaHelpingVolunteers) =>
        new NeedHelpService(volunteers),
      inject: [PrismaHelpingVolunteers],
    },
  ],
  imports: [PrismaModule],
  exports: [NeedHelpService],
})
export class NeedHelpModule {}
