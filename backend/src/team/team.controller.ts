import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Team } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/team-auth.decorator';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { CreateTeamDto } from './dto/createTeam.dto';
import { LinkTeamToUserDto } from './dto/linkTeamUser.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all teams',
    type: Array<string>,
  })
  async getTeams(): Promise<Team[]> {
    return this.teamService.team({ orderBy: { name: 'asc' } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('humain', 'sg')
  @Post('link')
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Link a user with different teams',
    type: LinkTeamToUserDto,
  })
  async updateUserTeams(
    @Body() payload: LinkTeamToUserDto,
  ): Promise<LinkTeamToUserDto> {
    return this.teamService.updateUserTeams(payload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create a team',
    type: CreateTeamDto,
  })
  async addTeam(@Body() payload: CreateTeamDto): Promise<Team> {
    return this.teamService.createTeam(payload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Update a team',
    type: UpdateTeamDto,
  })
  async updateTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamService.updateTeam(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a team',
  })
  async deleteTeam(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teamService.deleteTeam(id);
  }
}
