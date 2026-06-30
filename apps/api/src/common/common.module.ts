import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CommonService } from "./common.service";
import { PrismaModule } from "../prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [CommonService, PrismaService],
  exports: [CommonService, PrismaService],
})
export class CommonModule {}
