import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma.module";
import { StatisticsService } from "./statistics.service";
import { PrismaFestivalActivityStatistics } from "./repository/festival-activities.prisma";
import { PrismaService } from "../prisma.service";
import { PrismaFestivalTaskStatistics } from "./repository/festival-tasks.prisma";
@Module({
  providers: [
    {
      provide: PrismaFestivalActivityStatistics,
      useFactory: (prisma: PrismaService) =>
        new PrismaFestivalActivityStatistics(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaFestivalTaskStatistics,
      useFactory: (prisma: PrismaService) =>
        new PrismaFestivalTaskStatistics(prisma),
      inject: [PrismaService],
    },
    {
      provide: StatisticsService,
      useFactory: (
        festivalActivities: PrismaFestivalActivityStatistics,
        festivalTasks: PrismaFestivalTaskStatistics,
      ) => new StatisticsService(festivalActivities, festivalTasks),
      inject: [PrismaFestivalActivityStatistics, PrismaFestivalTaskStatistics],
    },
  ],
  imports: [PrismaModule],
  exports: [StatisticsService],
})
export class StatisticsModule {}
