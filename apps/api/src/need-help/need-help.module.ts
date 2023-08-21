import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { NeedHelpController } from "./need-help.controller";
import { PrismaVolunteerRepository } from "./volunteer.repository.prisma";
import { NeedHelpService } from "./need-help.service";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [CommonModule],
  controllers: [NeedHelpController],
  providers: [
    PrismaService,
    NeedHelpService,
    { provide: "VOLUNTEER_REPOSITORY", useClass: PrismaVolunteerRepository },
  ],
  exports: [NeedHelpService],
})
export class NeedHelpModule {}
