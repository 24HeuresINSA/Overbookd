import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { OrgaNeedsController } from "./orga-needs.controller";
import { OrgaNeedsService } from "./orga-needs.service";

@Module({
  imports: [],
  controllers: [OrgaNeedsController],
  providers: [PrismaService, OrgaNeedsService],
})
export class OrgaNeedsModule {}
