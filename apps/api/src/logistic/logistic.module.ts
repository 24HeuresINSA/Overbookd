import { Module } from "@nestjs/common";
import { SummaryGearModule } from "./summary-gear/summary-gear.module";

@Module({
  imports: [SummaryGearModule],
})
export class LogisticModule {}
