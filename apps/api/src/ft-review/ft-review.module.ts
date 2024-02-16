import { Module } from "@nestjs/common";
import { FtService } from "../ft/ft.service";
import { PrismaService } from "../prisma.service";
import { FtReviewController } from "./ft-review.controller";
import { FtReviewService } from "./ft-review.service";
import { FtUserRequestService } from "../ft-user-request/ft-user-request.service";
import { FtModule } from "../ft/ft.module";

@Module({
  imports: [FtModule],
  controllers: [FtReviewController],
  providers: [FtReviewService, PrismaService, FtService, FtUserRequestService],
})
export class FtReviewModule {}
