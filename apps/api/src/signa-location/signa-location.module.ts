import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { SignaLocationController } from "./signa-location.controller";
import { SignaLocationService } from "./signa-location.service";

@Module({
  controllers: [SignaLocationController],
  providers: [SignaLocationService, PrismaService],
})
export class SignaLocationModule {}
