import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ContributionController } from "./contribution.controller";
import { ContributionService } from "./contribution.service";

@Module({
  controllers: [ContributionController],
  providers: [ContributionService, PrismaService],
})
export class ContributionModule {}
