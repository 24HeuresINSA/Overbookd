import { Module } from "@nestjs/common";
import { StatsService } from "./services/stats.service";

@Module({
  providers: [StatsService],
  exports: [StatsService],
})
export class CommonModule {}
