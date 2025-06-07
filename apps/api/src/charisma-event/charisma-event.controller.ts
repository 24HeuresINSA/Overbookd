import {
  Controller,
  UseGuards,
  UseFilters,
  Post,
  Body,
  Get,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { CharismaEventService } from "./charisma-event.service";
import { CharismaEventErrorFilter } from "./charisma-event-error.filter";
import { MANAGE_CHARISMA_EVENTS } from "@overbookd/permission";
import { CharismaEventParticipationResponseDto } from "./dto/participation.response.dto";
import { Permission } from "../authentication/permissions-auth.decorator";
import { CreateCharismaEventParticipationsRequestDto } from "./dto/create-participations.request.dto";
import { CharismaEventPotentialParticipantResponseDto } from "./dto/potential-participant.response.dto";
import { DateString } from "@overbookd/time";
import { EditCharismaEventParticipationRequestDto } from "./dto/edit-participation.request.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags("charisma-events")
@Controller("charisma-events")
@UseFilters(CharismaEventErrorFilter)
@ApiSwaggerResponse()
export class CharismaEventController {
  constructor(private readonly charismaEvent: CharismaEventService) {}

  @Get("all-participations")
  @Permission(MANAGE_CHARISMA_EVENTS)
  @ApiResponse({
    status: 200,
    description: "List of all charisma event participations",
    type: CharismaEventParticipationResponseDto,
    isArray: true,
  })
  fetchAll(): Promise<CharismaEventParticipationResponseDto[]> {
    return this.charismaEvent.fetchAll();
  }

  @Get("potential-participants")
  @Permission(MANAGE_CHARISMA_EVENTS)
  @ApiResponse({
    status: 200,
    description: "List of all potential charisma event participants",
    type: CharismaEventPotentialParticipantResponseDto,
    isArray: true,
  })
  fetchPotentialParticipants(): Promise<
    CharismaEventPotentialParticipantResponseDto[]
  > {
    return this.charismaEvent.fetchPotentialParticipants();
  }

  @Post()
  @Permission(MANAGE_CHARISMA_EVENTS)
  @ApiResponse({
    status: 201,
    description: "List of all charisma event participations",
    type: CharismaEventParticipationResponseDto,
    isArray: true,
  })
  @ApiBody({
    description: "Charisma event participations to add",
    type: CreateCharismaEventParticipationsRequestDto,
  })
  addParticipations(
    @Body()
    { event, participants }: CreateCharismaEventParticipationsRequestDto,
  ): Promise<CharismaEventParticipationResponseDto[]> {
    return this.charismaEvent.addParticipations(event, participants);
  }

  @Patch(":slug/date/:date/participant/:participantId")
  @Permission(MANAGE_CHARISMA_EVENTS)
  @ApiResponse({
    status: 201,
    description: "List of all charisma event participations",
    type: CharismaEventParticipationResponseDto,
    isArray: true,
  })
  @ApiBody({
    description: "Charisma event participations to edit",
    type: EditCharismaEventParticipationRequestDto,
  })
  @ApiParam({
    name: "slug",
    description: "Charisma event slug",
    type: String,
  })
  @ApiParam({
    name: "date",
    description: "Charisma event date",
    type: String,
  })
  @ApiParam({
    name: "participantId",
    description: "Charisma event participant id",
    type: Number,
  })
  editParticipation(
    @Body() { charisma }: EditCharismaEventParticipationRequestDto,
    @Param("slug") slug: string,
    @Param("date") eventDate: DateString,
    @Param("participantId", ParseIntPipe) participantId: number,
  ): Promise<CharismaEventParticipationResponseDto> {
    return this.charismaEvent.editParticipation({
      slug,
      eventDate,
      participantId,
      charisma,
    });
  }

  @Delete(":slug/date/:date/participant/:participantId")
  @Permission(MANAGE_CHARISMA_EVENTS)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Charisma event participation deleted",
  })
  @ApiParam({
    name: "slug",
    description: "Charisma event slug",
    type: String,
  })
  @ApiParam({
    name: "date",
    description: "Charisma event date",
    type: String,
  })
  @ApiParam({
    name: "participantId",
    description: "Charisma event participant id",
    type: Number,
  })
  removeParticipation(
    @Param("slug") slug: string,
    @Param("date") date: DateString,
    @Param("participantId", ParseIntPipe) participantId: number,
  ): Promise<void> {
    return this.charismaEvent.removeParticipation(slug, date, participantId);
  }
}
