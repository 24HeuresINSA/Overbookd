import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { PrismaModule } from "../../prisma.module";
import { PrismaDashboardGears } from "./repository/dashboard-repository.prisma";

@Module({
  controllers: [DashboardController],
  providers: [
    {
      provide: PrismaDashboardGears,
      useFactory: (prisma: PrismaService) => new PrismaDashboardGears(prisma),
      inject: [PrismaService],
    },
    {
      provide: DashboardService,
      useFactory: (dashboardGears: PrismaDashboardGears) =>
        new DashboardService(dashboardGears),
      inject: [PrismaDashboardGears],
    },
  ],
  imports: [PrismaModule],
})
export class DashboardModule {}
