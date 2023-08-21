import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { FtTeamRequestController } from "./ft-team-request.controller";
import { FtTeamRequestService } from "./ft-team-request.service";

@Module({
  controllers: [FtTeamRequestController],
  providers: [FtTeamRequestService, PrismaService],
})
export class FtTeamRequestModule {}
