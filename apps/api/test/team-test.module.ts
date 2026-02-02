import { Module } from "@nestjs/common";
import { TeamController } from "../src/team/team.controller";
import { TeamService } from "../src/team/team.service";

@Module({
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamTestModule {}
