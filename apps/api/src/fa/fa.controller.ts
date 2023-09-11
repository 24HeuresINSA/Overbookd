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
  Query,
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
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { StatsPayload } from "../common/services/stats.service";
import {
  ApprovedGearRequest,
  GearSeekerType,
} from "../gear-request/gear-request.model";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
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
import { GearRequestService } from "../gear-request/gear-request.service";
import { CompleteFaResponseDto } from "./dto/complete-fa.response.dto";
import { CreateFaRequestDto } from "./dto/create-fa.request.dto";
import { FaSearchRequestDto } from "./dto/fa-search.request.dto";
import { LiteFaResponseDto } from "./dto/lite-fa.response.dto";
import { UpdateFaRequestDto } from "./dto/update-fa.request.dto";
import { CompleteFaResponse, LiteFaResponse } from "./fa.model";
import { FaService } from "./fa.service";
import { FaIdResponse } from "./faTypes";
import { CollaboratorResponseDto } from "../collaborator/dto/collaborator.response.dto";
import { CollaboratorRequestDto } from "../collaborator/dto/collaborator.request.dto";
import { CollaboratorWithId } from "../collaborator/collaborator.model";
import { StatsResponseDto } from "./dto/stats.response.dto";
import { FollowingFaResponseDto } from "./dto/following-fa.response.dto";
import {
  READ_FA,
  VALIDATE_FA,
  VIEW_FESTIVAL_EVENTS_STATS,
  WRITE_FA,
} from "@overbookd/permission";

@ApiBearerAuth()
@ApiTags("fa")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiNotFoundResponse({
  description: "Can't find a requested resource",
})
@Controller("fa")
export class FaController {
  constructor(
    private readonly faService: FaService,
    private readonly gearRequestService: GearRequestService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post()
  @ApiResponse({
    status: 201,
    description: "Create a new fa",
    type: CompleteFaResponseDto,
  })
  create(@Body() FA: CreateFaRequestDto): Promise<CompleteFaResponse> {
    return this.faService.create(FA);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all fa",
    isArray: true,
    type: LiteFaResponseDto,
  })
  @ApiQuery({
    name: "isDeleted",
    required: false,
    type: Boolean,
    description: "Get FAs that are deleted",
  })
  findAll(
    @Query() searchRequest: FaSearchRequestDto,
  ): Promise<LiteFaResponse[]> {
    return this.faService.findAll(searchRequest);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_FESTIVAL_EVENTS_STATS)
  @Get("stats")
  @ApiResponse({
    status: 200,
    description: "Get FA stats",
    isArray: true,
    type: StatsResponseDto,
  })
  getFaStats(): Promise<StatsPayload[]> {
    return this.faService.getFaStats();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "Get a fa",
    type: CompleteFaResponseDto,
  })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<CompleteFaResponse> {
    return this.faService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id")
  @ApiResponse({
    status: 201,
    description: "Update a fa",
    type: CompleteFaResponseDto,
  })
  @ApiBody({
    description: "Update a fa",
    type: UpdateFaRequestDto,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateFaDto: UpdateFaRequestDto,
  ): Promise<CompleteFaResponse> {
    return this.faService.update(id, updateFaDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":id")
  @ApiResponse({
    status: 204,
    description: "Delete a fa",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.faService.remove(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get(":id/previous")
  @ApiResponse({
    status: 200,
    description: "Get the previous fa",
    type: FollowingFaResponseDto,
  })
  findPrevious(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FaIdResponse | null> {
    return this.faService.findPrevious(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get(":id/next")
  @ApiResponse({
    status: 200,
    description: "Get the next fa",
    type: FollowingFaResponseDto,
  })
  findNext(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FaIdResponse | null> {
    return this.faService.findNext(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/collaborator")
  @ApiResponse({
    status: 201,
    description: "Add a collaborator to a fa",
    type: CollaboratorResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "FA id",
    required: true,
  })
  @ApiBody({
    description: "Collaborator to add",
    type: CollaboratorRequestDto,
  })
  addCollaborator(
    @Param("id", ParseIntPipe) id: number,
    @Body() collaborator: CollaboratorRequestDto,
  ): Promise<CollaboratorWithId> {
    return this.faService.addCollaborator(id, collaborator);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":id/collaborator")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Remove a collaborator from a fa",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "FA id",
    required: true,
  })
  removeCollaborator(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.faService.removeCollaborator(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/gear-requests")
  @ApiResponse({
    status: 201,
    description: "Creating a new gear request",
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Animation id",
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
    return this.gearRequestService.addAnimationRequest({
      ...gearRequestForm,
      seekerId: id,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get(":id/gear-requests")
  @ApiResponse({
    status: 200,
    description: "Get animation gear requests",
    isArray: true,
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Animation id",
    required: true,
  })
  getGearRequests(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GearRequestResponseDto[]> {
    return this.gearRequestService.getAnimationRequests(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FA)
  @Patch(
    ":animationId/gear-requests/:gearId/rental-period/:rentalPeriodId/approve",
  )
  @ApiResponse({
    status: 200,
    description: "Gear request approved",
    type: ApprovedGearRequestResponseDto,
  })
  @ApiParam({
    name: "animationId",
    type: Number,
    description: "Animation id",
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
    @Param("animationId", ParseIntPipe) animationId: number,
    @Param("gearId", ParseIntPipe) gearId: number,
    @Param("rentalPeriodId", ParseIntPipe) rentalPeriodId: number,
    @Body() approveForm: ApproveGearRequestRequestDto,
  ): Promise<ApprovedGearRequest> {
    const gearRequestId = {
      seeker: { type: GearSeekerType.Animation, id: animationId },
      gearId,
      rentalPeriodId,
    };
    const { drive } = approveForm;
    return this.gearRequestService.approveGearRequest(gearRequestId, drive);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":animationId/gear-requests/:gearId/rental-period/:rentalPeriodId")
  @ApiResponse({
    status: 200,
    description: "Update an existing gear request",
    type: GearRequestResponseDto,
  })
  @ApiParam({
    name: "animationId",
    type: Number,
    description: "Animation id",
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
    @Param("animationId", ParseIntPipe) animationId: number,
    @Param("gearId", ParseIntPipe) gearId: number,
    @Param("rentalPeriodId", ParseIntPipe) rentalPeriodId: number,
    @Body() gearRequestForm: UpdateGearRequestRequestDto,
  ): Promise<GearRequestResponseDto> {
    return this.gearRequestService.updateAnimationRequest(
      animationId,
      gearId,
      rentalPeriodId,
      gearRequestForm,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":animationId/gear-requests/:gearId/rental-period/:rentalPeriodId")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Gear request deleted",
  })
  @ApiParam({
    name: "animationId",
    type: Number,
    description: "Animation id",
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
    @Param("animationId", ParseIntPipe) animationId: number,
    @Param("gearId", ParseIntPipe) gearId: number,
    @Param("rentalPeriodId", ParseIntPipe) rentalPeriodId: number,
  ): Promise<void> {
    return this.gearRequestService.removeAnimationRequest(
      animationId,
      gearId,
      rentalPeriodId,
    );
  }
}
