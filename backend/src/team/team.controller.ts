import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/team-auth.decorator';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { CreateTeamDto } from './dto/createTeam.dto';
import { LinkTeamToUserDto } from './dto/linkTeamUser.dto';
import { TeamService } from './team.service';

@ApiBearerAuth()
@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('humain')
  @Post('link')
  async updateUserTeams(@Body() payload: LinkTeamToUserDto): Promise<boolean> {
    return this.teamService.updateUserTeams(payload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async addTeam(@Body() payload: CreateTeamDto): Promise<boolean> {
    return this.teamService.createTeam(payload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  async deleteTeam(@Body() payload: CreateTeamDto): Promise<boolean> {
    return this.teamService.deleteTeam(payload);
  }
}
