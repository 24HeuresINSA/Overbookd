import { Module } from "@nestjs/common";
import { FtUserRequestService } from "../ft-user-request/ft-user-request.service";
import { PrismaService } from "../prisma.service";
import { FtController } from "./ft.controller";
import { FtService } from "./ft.service";
import { StatsService } from "./stats.service";

@Module({
  controllers: [FtController],
  providers: [FtService, PrismaService, FtUserRequestService, StatsService],
  exports: [StatsService],
})
export class FtModule {}
