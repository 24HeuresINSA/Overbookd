import { Module } from "@nestjs/common";
import { TimelineService } from "./timeline.service";
import { PrismaService } from "../../src/prisma.service";
import { TimelineController } from "./timeline.controller";

@Module({
  controllers: [TimelineController],
  providers: [TimelineService, PrismaService],
})
export class TimelineModule {}
