import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";

@Module({
  controllers: [FestivalActivityController],
  providers: [FestivalActivityService],
})
export class FestivalActivityModule {}
