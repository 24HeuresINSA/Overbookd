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
import { StatsPayload } from "../../src/common/services/stats.service";
import { ApproveGearRequestRequestDto } from "../gear-request/dto/approve-gear-request.request.dto";
import {
  ExistingPeriodGearRequestFormRequestDto,
  GearRequestRequestDto,
  NewPeriodGearRequestFormRequestDto,
} from "../gear-request/dto/gear-request.request.dto";
import {
  ApprovedGearRequestResponseDto,
  GearRequestResponseDto,
} from "../gear-request/dto/gear-request.response.dto";
import { UpdateGearRequestRequestDto } from "../gear-request/dto/update-gear-request.request.dto";
import {
  ApprovedGearRequest,
  GearSeekerType,
} from "../gear-request/gear-request.model";
import { GearRequestService } from "../gear-request/gear-request.service";
import { PeriodDto } from "../../src/volunteer-availability/dto/period.dto";
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
import { StatsResponseDto } from "../fa/dto/stats.response.dto";
import { FollowingFtResponseDto } from "./dto/following-ft.response.dto";

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
  constructor(
    private readonly ftService: FtService,
    private readonly gearRequestService: GearRequestService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("write-ft")
  @Post()
  @HttpCode(201)
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
  @Permission("write-ft")
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
  @Permission("write-ft")
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
  @Permission("write-ft")
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
  @Permission("write-ft")
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
  @Permission("write-ft")
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
  @Permission("write-ft")
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
  @Permission("write-ft")
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
  @Permission("write-ft")
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
  @Permission("write-ft")
  @Post(":id/gear-requests")
  @ApiResponse({
    status: 201,
    description: "Creating a new gear request",
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Task id",
    required: true,
  })
  @ApiBody({ type: GearRequestRequestDto })
  addGearRequest(
    @Param("id", ParseIntPipe) id: number,
    @Body()
    gearRequestForm:
      | NewPeriodGearRequestFormRequestDto
      | ExistingPeriodGearRequestFormRequestDto,
  ): Promise<GearRequestResponseDto> {
    return this.gearRequestService.addTaskRequest({
      ...gearRequestForm,
      seekerId: id,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("write-ft")
  @Get(":id/gear-requests")
  @ApiResponse({
    status: 200,
    description: "Get task gear requests",
    isArray: true,
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Task id",
    required: true,
  })
  getGearRequests(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GearRequestResponseDto[]> {
    return this.gearRequestService.getTaskRequests(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("write-ft")
  @Delete(":taskId/gear-requests/")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete gear requests on a dedicated period",
  })
  @ApiParam({
    name: "taskId",
    type: Number,
    description: "Task id",
    required: true,
  })
  @ApiBody({
    type: PeriodDto,
    description: "Period to remove gear requests on",
    required: true,
  })
  async deleteGearRequests(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Body() period: PeriodDto,
  ): Promise<void> {
    await this.gearRequestService.removeTaskRequests(taskId, period);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("write-ft")
  @Delete(":taskId/gear-requests/:gearId/rental-period/:rentalPeriodId")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Gear request deleted",
  })
  @ApiParam({
    name: "taskId",
    type: Number,
    description: "Task id",
    required: true,
  })
  @ApiParam({
    name: "gearId",
    type: Number,
    description: "Gear id",
    required: true,
  })
  @ApiParam({
    name: "rentalPeriodId",
    type: Number,
    description: "Rental period id",
    required: true,
  })
  deleteGearRequest(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("gearId", ParseIntPipe) gearId: number,
    @Param("rentalPeriodId", ParseIntPipe) rentalPeriodId: number,
  ): Promise<void> {
    return this.gearRequestService.removeTaskRequest(
      taskId,
      gearId,
      rentalPeriodId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("write-ft")
  @Patch(":taskId/gear-requests/:gearId/rental-period/:rentalPeriodId")
  @ApiResponse({
    status: 200,
    description: "Update an existing gear request",
    type: GearRequestResponseDto,
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
  @ApiParam({
    name: "gearId",
    type: Number,
    description: "Gear id",
    required: true,
  })
  @ApiParam({
    name: "rentalPeriodId",
    type: Number,
    description: "Rental period id",
    required: true,
  })
  updateGearRequest(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("gearId", ParseIntPipe) gearId: number,
    @Param("rentalPeriodId", ParseIntPipe) rentalPeriodId: number,
    @Body() gearRequestForm: UpdateGearRequestRequestDto,
  ): Promise<GearRequestResponseDto> {
    return this.gearRequestService.updateTaskRequest(
      taskId,
      gearId,
      rentalPeriodId,
      gearRequestForm,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("write-ft")
  @Patch(":taskId/gear-requests/:gearId/rental-period/:rentalPeriodId/approve")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Gear request approved",
    type: ApprovedGearRequestResponseDto,
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
  @ApiParam({
    name: "gearId",
    type: Number,
    description: "Gear id",
    required: true,
  })
  @ApiParam({
    name: "rentalPeriodId",
    type: Number,
    description: "Rental period id",
    required: true,
  })
  approveGearRequest(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Param("gearId", ParseIntPipe) gearId: number,
    @Param("rentalPeriodId", ParseIntPipe) rentalPeriodId: number,
    @Body() approveForm: ApproveGearRequestRequestDto,
  ): Promise<ApprovedGearRequest> {
    const gearRequestId = {
      seeker: { type: GearSeekerType.Task, id: taskId },
      gearId,
      rentalPeriodId,
    };
    const { drive } = approveForm;
    return this.gearRequestService.approveGearRequest(gearRequestId, drive);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("validate-ft")
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
