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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MANAGE_TEAMS, READ_FA, READ_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { CreateTeamRequestDto } from "./dto/create-team.request.dto";
import { TeamResponseDto } from "./dto/team.response";
import { UpdateTeamRequestDto } from "./dto/update-team.request";
import { TeamService } from "./team.service";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("teams")
@ApiTags("teams")
@ApiSwaggerResponse()
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
  @Get("fa-reviewers")
  @ApiResponse({
    status: 200,
    description: "Get all FA reviewers",
    type: TeamResponseDto,
    isArray: true,
  })
  async findFaReviewers(): Promise<TeamResponseDto[]> {
    return this.teamService.findFaReviewers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FT)
  @Get("ft-reviewers")
  @ApiResponse({
    status: 200,
    description: "Get all FT reviewers",
    type: TeamResponseDto,
    isArray: true,
  })
  async findFtReviewers(): Promise<TeamResponseDto[]> {
    return this.teamService.findFtReviewers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_TEAMS)
  @Post()
  @ApiBearerAuth()
  @ApiBody({
    description: "Team to create",
    type: CreateTeamRequestDto,
  })
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
  @ApiBody({
    description: "Team to update",
    type: UpdateTeamRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "Update a team",
    type: TeamResponseDto,
  })
  updateTeam(
    @Param("code") code: string,
    @Body() data: UpdateTeamRequestDto,
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
  deleteTeam(@Param("code") code: string): Promise<void> {
    return this.teamService.deleteTeam(code);
  }
}
