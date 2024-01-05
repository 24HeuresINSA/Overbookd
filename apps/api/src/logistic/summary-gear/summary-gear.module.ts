import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { SummaryGearController } from "./summary-gear.controller";
import { SummaryGearService } from "./summary-gear.service";
import { PrismaModule } from "../../prisma.module";
import { PrismaSummaryGears } from "./repository/summary-gear-repository.prisma";

@Module({
  controllers: [SummaryGearController],
  providers: [
    {
      provide: PrismaSummaryGears,
      useFactory: (prisma: PrismaService) => new PrismaSummaryGears(prisma),
      inject: [PrismaService],
    },
    {
      provide: SummaryGearService,
      useFactory: (summaryGears: PrismaSummaryGears) =>
        new SummaryGearService(summaryGears),
      inject: [PrismaSummaryGears],
    },
  ],
  imports: [PrismaModule],
})
export class SummaryGearModule {}
