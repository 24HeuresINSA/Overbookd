import { Module } from "@nestjs/common";
import { LogisticController } from "./logistic.controller";
import { SummaryGearModule } from "./summary-gear/summary-gear.module";

@Module({
  imports: [SummaryGearModule],
  controllers: [LogisticController],
})
export class LogisticModule {}
