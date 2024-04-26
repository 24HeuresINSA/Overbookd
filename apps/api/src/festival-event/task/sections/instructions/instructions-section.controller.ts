import {
  UseFilters,
  Controller,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Post,
  Delete,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiBody,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { InstructionsSectionService } from "./instructions-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { FORCE_WRITE_FT, WRITE_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { InstructionsRequestDto } from "./dto/update-instructions.request.dto";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { Contact, FestivalTask, Volunteer } from "@overbookd/festival-event";
import { AddContactRequestDto } from "./dto/add-contact.request.dto";
import { AddInChargeVolunteerRequestDto } from "./dto/add-volunteer.request.dto";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import {
  InReviewFestivalTaskResponseDto,
  ReadyToAssignFestivalTaskResponseDto,
} from "../../common/dto/reviewable/reviewable-festival-task.response.dto";
import { RequestWithUserPayload } from "../../../../app.controller";
import { InitInChargeRequestDto } from "./dto/init-in-charge.request.dto";
import {
  ForceGlobalInstructionsRequestDto,
  ForceInChargeInstructionsRequestDto,
  ForceInstructionsRequestDto,
} from "./dto/force-instructions.request.dto";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@Controller("festival-tasks")
export class InstructionsSectionController {
  constructor(
    private readonly instructionsService: InstructionsSectionService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Patch(":id/instructions")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Instructions section of festival activity to save",
    type: InstructionsRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  update(
    @Param("id", ParseIntPipe) id: FestivalTask["id"],
    @Body() instructions: InstructionsRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalTask> {
    return this.instructionsService.update(id, instructions, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(FORCE_WRITE_FT)
  @Patch(":id/force/instructions")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    type: ReadyToAssignFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "Instructions section of festival activity to save",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(ForceGlobalInstructionsRequestDto) },
        { $ref: getSchemaPath(ForceInChargeInstructionsRequestDto) },
        { $ref: getSchemaPath(ForceInstructionsRequestDto) },
      ],
    },
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  force(
    @Param("id", ParseIntPipe) id: FestivalTask["id"],
    @Body()
    instructions:
      | ForceGlobalInstructionsRequestDto
      | ForceInChargeInstructionsRequestDto
      | ForceInstructionsRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<ReadyToAssignFestivalTaskResponseDto> {
    return this.instructionsService.force(id, instructions, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/instructions/contacts")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Contact to add",
    type: AddContactRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addContact(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Body() { contactId }: AddContactRequestDto,
  ): Promise<FestivalTask> {
    return this.instructionsService.addContact(ftId, contactId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":ftId/instructions/contacts/:contactId")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "contactId",
    type: Number,
    description: "Contact id",
    required: true,
  })
  removeContact(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("contactId", ParseIntPipe) contactId: Contact["id"],
  ): Promise<FestivalTask> {
    return this.instructionsService.removeContact(ftId, contactId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/instructions/in-charge/volunteers")
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Volunteer to add",
    type: AddInChargeVolunteerRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  addInChargeVolunteer(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Body() { volunteerId }: AddInChargeVolunteerRequestDto,
  ): Promise<FestivalTask> {
    return this.instructionsService.addInChargeVolunteer(ftId, volunteerId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":ftId/instructions/in-charge/volunteers/:volunteerId")
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "volunteerId",
    type: Number,
    description: "Volunteer id",
    required: true,
  })
  removeInChargeVolunteer(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("volunteerId", ParseIntPipe) volunteerId: Volunteer["id"],
  ): Promise<FestivalTask> {
    return this.instructionsService.removeInChargeVolunteer(ftId, volunteerId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/instructions/in-charge")
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Init in charge form",
    type: InitInChargeRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  initInCharge(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Body() form: InitInChargeRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalTask> {
    return this.instructionsService.initInCharge(ftId, form, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":ftId/instructions/in-charge")
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  clearInCharge(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalTask> {
    return this.instructionsService.clearInCharge(ftId, user);
  }
}
