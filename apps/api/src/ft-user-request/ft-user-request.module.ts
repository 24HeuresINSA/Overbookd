import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { FtUserRequestController } from "./ft-user-request.controller";
import { FtUserRequestService } from "./ft-user-request.service";

@Module({
  controllers: [FtUserRequestController],
  providers: [FtUserRequestService, PrismaService],
})
export class FtUserRequestModule {}
