import {
  UseFilters,
  Controller,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { InstructionsSectionService } from "./instructions-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { FORCE_WRITE_FT, WRITE_FT } from "@overbookd/permission";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { InstructionsRequestDto } from "./dto/update-instructions.request.dto";
import { Permissions } from "../../../../authentication-zitadel/decorators/permissions-auth.decorator";
import { Contact, FestivalTask, Volunteer } from "@overbookd/festival-event";
import { AddContactRequestDto } from "./dto/add-contact.request.dto";
import { AddInChargeVolunteerRequestDto } from "./dto/add-volunteer.request.dto";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import {
  InReviewFestivalTaskResponseDto,
  ReadyToAssignFestivalTaskResponseDto,
  RefusedFestivalTaskResponseDto,
  ValidatedFestivalTaskResponseDto,
} from "../../common/dto/reviewable/reviewable-festival-task.response.dto";
import { InitInChargeRequestDto } from "./dto/init-in-charge.request.dto";
import {
  ForceGlobalInstructionsRequestDto,
  ForceInChargeInstructionsRequestDto,
  ForceInstructionsRequestDto,
} from "./dto/force-instructions.request.dto";
import { ApiSwaggerResponse } from "../../../../api-swagger-response.decorator";
import { AuthenticatedUser } from "../../../../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../../../../authentication-zitadel/request-hydrated-user";

@Controller("festival-tasks")
@ApiTags("festival-tasks")
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
export class InstructionsSectionController {
  constructor(
    private readonly instructionsService: InstructionsSectionService,
  ) {}

  @Patch(":id/instructions")
  @Permissions(WRITE_FT)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<FestivalTask> {
    return this.instructionsService.update(id, instructions, user);
  }

  @Patch(":id/force/instructions")
  @Permissions(FORCE_WRITE_FT)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalTaskResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalTaskResponseDto) },
        { $ref: getSchemaPath(ReadyToAssignFestivalTaskResponseDto) },
      ],
    },
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<FestivalTask> {
    return this.instructionsService.force(id, instructions, user);
  }

  @Post(":ftId/instructions/contacts")
  @Permissions(WRITE_FT)
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

  @Delete(":ftId/instructions/contacts/:contactId")
  @Permissions(WRITE_FT)
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

  @Post(":ftId/instructions/in-charge/volunteers")
  @Permissions(WRITE_FT)
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

  @Delete(":ftId/instructions/in-charge/volunteers/:volunteerId")
  @Permissions(WRITE_FT)
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

  @Post(":ftId/instructions/in-charge")
  @Permissions(WRITE_FT)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<FestivalTask> {
    return this.instructionsService.initInCharge(ftId, form, user);
  }

  @Delete(":ftId/instructions/in-charge")
  @Permissions(WRITE_FT)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<FestivalTask> {
    return this.instructionsService.clearInCharge(ftId, user);
  }
}
