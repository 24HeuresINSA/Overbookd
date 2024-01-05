import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RequestWithUserPayload } from "../../src/app.controller";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { StatsPayload } from "./stats.service";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { CreateFtRequestDto } from "./dto/create-ft.request.dto";
import {
  CompleteFtResponseDto,
  LiteFtResponseDto,
} from "./dto/ft.response.dto";
import { FTSearchRequestDto } from "./dto/ft-search.request.dto";
import { UpdateFtRequestDto } from "./dto/update-ft.request.dto";
import { ftStatuses } from "./ft.model";
import { FtService } from "./ft.service";
import { FtIdResponse } from "./ft-types";
import { ReviewerResponseDto } from "./dto/reviewer.response.dto";
import { ReviewerRequestDto } from "./dto/reviewer.request.dto";
import { FollowingFtResponseDto } from "./dto/following-ft.response.dto";
import {
  READ_FT,
  VALIDATE_FT,
  VIEW_FESTIVAL_EVENTS_STATS,
  WRITE_FT,
} from "@overbookd/permission";
import { StatsResponseDto } from "./dto/stats.response.dto";

@ApiBearerAuth()
@ApiTags("ft")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("ft")
export class FtController {
  constructor(private readonly ftService: FtService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post()
  @ApiResponse({
    status: 201,
    description: "The ft has been successfully created.",
    type: CompleteFtResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Request is not formated as expected",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  create(
    @Body() ft: CreateFtRequestDto,
  ): Promise<CompleteFtResponseDto | null> {
    return this.ftService.create(ft);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FT)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all ft",
    isArray: true,
    type: LiteFtResponseDto,
  })
  @ApiQuery({
    name: "isDeleted",
    required: false,
    type: Boolean,
    description: "Get FTs that are deleted",
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: String,
    enum: ftStatuses,
    description: "Get FTs with a specific status",
  })
  findAll(
    @Query() searchRequest: FTSearchRequestDto,
  ): Promise<LiteFtResponseDto[]> {
    return this.ftService.findAll(searchRequest);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_FESTIVAL_EVENTS_STATS)
  @Get("stats")
  @ApiResponse({
    status: 200,
    description: "Get FT stats",
    isArray: true,
    type: StatsResponseDto,
  })
  getFtStats(): Promise<StatsPayload[]> {
    return this.ftService.getFtStats();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FT)
  @Get(":id")
  @ApiParam({
    name: "id",
    type: Number,
    description: "FT id",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Get ft by id",
    type: CompleteFtResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CompleteFtResponseDto | null> {
    return this.ftService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Patch(":id")
  @ApiResponse({
    status: 200,
    description: "ft updated",
    type: CompleteFtResponseDto,
  })
  @ApiBody({
    description: "Updated ft",
    type: UpdateFtRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "FT id",
    required: true,
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateFtDto: UpdateFtRequestDto,
    @Request() req: RequestWithUserPayload,
  ): Promise<CompleteFtResponseDto | null> {
    return this.ftService.update(id, updateFtDto, new JwtUtil(req.user));
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Patch(":id/submit")
  @ApiResponse({
    status: 200,
    description: "ft submitted",
    type: CompleteFtResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "FT id",
    required: true,
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  submit(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CompleteFtResponseDto | null> {
    return this.ftService.submit(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":id")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "ft deleted",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "FT id",
    required: true,
  })
  remove(@Param("id") id: number) {
    return this.ftService.remove(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FT)
  @Get(":id/previous")
  @ApiResponse({
    status: 200,
    description: "Get the previous ft",
    type: FollowingFtResponseDto,
  })
  findPrevious(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FtIdResponse | null> {
    return this.ftService.findPrevious(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FT)
  @Get(":id/next")
  @ApiResponse({
    status: 200,
    description: "Get the next ft",
    type: FollowingFtResponseDto,
  })
  findNext(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FtIdResponse | null> {
    return this.ftService.findNext(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FT)
  @Put(":taskId/humanReviewer")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Assigned reviewer",
    type: ReviewerResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  @ApiParam({
    name: "taskId",
    type: Number,
    description: "Task id",
    required: true,
  })
  @ApiBody({
    description: "Reviewer to assign",
    type: ReviewerRequestDto,
  })
  assignReviewer(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Body() reviewerForm: ReviewerRequestDto,
  ): Promise<ReviewerResponseDto> {
    return this.ftService.assignReviewer(taskId, reviewerForm.id);
  }
}
