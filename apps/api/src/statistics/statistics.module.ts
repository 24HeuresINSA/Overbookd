import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma.module";
import { StatisticsService } from "./statistics.service";
import { PrismaFestivalActivities } from "./repository/festival-activities.prisma";
import { PrismaService } from "../prisma.service";
@Module({
  providers: [
    {
      provide: PrismaFestivalActivities,
      useFactory: (prisma: PrismaService) =>
        new PrismaFestivalActivities(prisma),
      inject: [PrismaService],
    },
    {
      provide: StatisticsService,
      useFactory: (festivalActivities: PrismaFestivalActivities) =>
        new StatisticsService(festivalActivities),
      inject: [PrismaFestivalActivities],
    },
  ],
  imports: [PrismaModule],
  exports: [StatisticsService],
})
export class StatisticsModule {}
