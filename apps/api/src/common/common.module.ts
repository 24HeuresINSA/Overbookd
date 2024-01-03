import { Module } from "@nestjs/common";
import { StatsService } from "../ft/stats.service";

@Module({
  providers: [StatsService],
  exports: [StatsService],
})
export class CommonModule {}
