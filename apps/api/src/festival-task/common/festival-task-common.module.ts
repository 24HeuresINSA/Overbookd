import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma.module";

@Module({
  providers: [],
  imports: [PrismaModule],
  exports: [],
})
export class FestivalTaskCommonModule {}
