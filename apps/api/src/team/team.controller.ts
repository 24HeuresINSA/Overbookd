import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { CreateTeamRequestDto } from "./dto/create-team.request.dto";
import { TeamResponseDto } from "./dto/team.response";
import { TeamService } from "./team.service";
import { MANAGE_TEAMS, READ_FA, READ_FT } from "@overbookd/permission";

@ApiTags("teams")
@Controller("teams")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all teams",
    type: TeamResponseDto,
    isArray: true,
  })
  async findAll(): Promise<TeamResponseDto[]> {
    return this.teamService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get("fa-validators")
  @ApiResponse({
    status: 200,
    description: "Get all fa validators",
    type: TeamResponseDto,
    isArray: true,
  })
  async findAllFaValidators(): Promise<TeamResponseDto[]> {
    return this.teamService.findFaValidators();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FT)
  @Get("ft-validators")
  @ApiResponse({
    status: 200,
    description: "Get all ft validators",
    type: TeamResponseDto,
    isArray: true,
  })
  async findAllFtValidators(): Promise<TeamResponseDto[]> {
    return this.teamService.findFtValidators();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_TEAMS)
  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Create a team",
    type: TeamResponseDto,
  })
  async createTeam(
    @Body() payload: CreateTeamRequestDto,
  ): Promise<TeamResponseDto> {
    return this.teamService.createTeam(payload);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_TEAMS)
  @Patch(":code")
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Update a team",
    type: TeamResponseDto,
  })
  async updateTeam(
    @Param("code") code: string,
    @Body() data: CreateTeamRequestDto,
  ): Promise<TeamResponseDto> {
    return this.teamService.updateTeam(code, data);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_TEAMS)
  @Delete(":code")
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a team",
  })
  async deleteTeam(@Param("code") code: string): Promise<void> {
    return this.teamService.deleteTeam(code);
  }
}
