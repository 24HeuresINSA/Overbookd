import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { FaFeedbackController } from "./fa-feedback.controller";
import { FaFeedbackService } from "./fa-feedback.service";

@Module({
  controllers: [FaFeedbackController],
  providers: [FaFeedbackService, PrismaService],
})
export class FaFeedbackModule {}
