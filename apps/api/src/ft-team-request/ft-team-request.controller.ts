import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { CreateFtTeamRequestRequestDto } from "./dto/create-ft-team-request.request.dto";
import { FtTeamRequestResponseDto } from "./dto/ft-team-request.response.dto";
import { FtTeamRequestService } from "./ft-team-request.service";

@ApiBearerAuth()
@ApiTags("ft")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiNotFoundResponse({
  description: "Resource not found",
})
@Controller("ft")
export class FtTeamRequestController {
  constructor(private readonly ftTeamRequestService: FtTeamRequestService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("hard")
  @Post(":ftId/time-windows/:twId/team-requests")
  @HttpCode(201)
  @ApiBody({
    description: "All of the team requests to create",
    type: CreateFtTeamRequestRequestDto,
    isArray: true,
  })
  @ApiResponse({
    status: 201,
    description: "The team request has been successfully created.",
    type: FtTeamRequestResponseDto,
    isArray: true,
  })
  async create(
    @Body() createFtTeamRequestDto: CreateFtTeamRequestRequestDto[],
    @Param("ftId", ParseIntPipe) ftId: number,
    @Param("twId", ParseIntPipe) twId: number,
  ): Promise<FtTeamRequestResponseDto[]> {
    return this.ftTeamRequestService.create(createFtTeamRequestDto, ftId, twId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("hard")
  @Delete(":ftId/time-windows/:twId/team-requests/:teamCode")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "The team request has been successfully deleted.",
  })
  remove(
    @Param("ftId", ParseIntPipe) ftId: number,
    @Param("twId", ParseIntPipe) twId: number,
    @Param("teamCode") teamCode: string,
  ) {
    return this.ftTeamRequestService.remove(ftId, twId, teamCode);
  }
}
