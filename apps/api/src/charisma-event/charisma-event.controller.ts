import { Controller, UseGuards, UseFilters, Post, Body } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { CharismaEventService } from "./charisma-event.service";
import { CharismaEventErrorFilter } from "./charisma-event-error.filter";
import { MANAGE_CHARISMA_EVENTS } from "@overbookd/permission";
import { CharismaEventParticipationResponseDto } from "./dto/charisma-event-participation.response.dto";
import { Permission } from "../authentication/permissions-auth.decorator";
import { CreateCharismaEventParticipationsRequestDto } from "./dto/create-charisma-event-participations.request.dto";

@ApiTags("charisma-events")
@Controller("charisma-events")
@UseFilters(CharismaEventErrorFilter)
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
export class CharismaEventController {
  constructor(private readonly charismaEvent: CharismaEventService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_CHARISMA_EVENTS)
  @Post()
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
}
