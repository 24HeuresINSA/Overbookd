import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PublicAnimationController } from "./public-animation.controller";
import { PublicAnimationService } from "./public-animation.service";

@Module({
  controllers: [PublicAnimationController],
  providers: [PublicAnimationService, PrismaService],
})
export class PublicAnimationModule {}
