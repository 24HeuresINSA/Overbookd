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
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiBody,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { InstructionsSectionService } from "./instructions-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { WRITE_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { InstructionsRequestDto } from "./dto/update-instructions.request.dto";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { Contact, FestivalTask } from "@overbookd/festival-event";
import { AddContactRequestDto } from "./dto/add-contact.request.dto";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseFilters(FestivalTaskErrorFilter)
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
    type: DraftFestivalTaskResponseDto,
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
  ): Promise<FestivalTask> {
    return this.instructionsService.update(id, instructions);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":id/instructions/contacts")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    type: DraftFestivalTaskResponseDto,
  })
  @ApiBody({
    description: "Contact to ass",
    type: AddContactRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addContact(
    @Param("id", ParseIntPipe) id: FestivalTask["id"],
    @Body() { contactId }: AddContactRequestDto,
  ): Promise<FestivalTask> {
    return this.instructionsService.addContact(id, contactId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":ftId/instructions/contacts/:contactId")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    type: DraftFestivalTaskResponseDto,
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
}
