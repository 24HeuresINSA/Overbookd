import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma.module";
import { StatisticsService } from "./statistics.service";
import { PrismaFestivalActivityStatistics } from "./repository/festival-activities.prisma";
import { PrismaService } from "../prisma.service";
@Module({
  providers: [
    {
      provide: PrismaFestivalActivityStatistics,
      useFactory: (prisma: PrismaService) =>
        new PrismaFestivalActivityStatistics(prisma),
      inject: [PrismaService],
    },
    {
      provide: StatisticsService,
      useFactory: (festivalActivities: PrismaFestivalActivityStatistics) =>
        new StatisticsService(festivalActivities),
      inject: [PrismaFestivalActivityStatistics],
    },
  ],
  imports: [PrismaModule],
  exports: [StatisticsService],
})
export class StatisticsModule {}
