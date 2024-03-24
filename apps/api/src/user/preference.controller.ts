import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiBody,
} from "@nestjs/swagger";
import { PreferenceService } from "./preference.service";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PreferenceDto } from "./dto/preference.dto";
import { RequestWithUserPayload } from "../app.controller";

@ApiBearerAuth()
@ApiTags("preferences")
@Controller("preferences")
@ApiBadRequestResponse({ description: "Bad Request" })
@ApiForbiddenResponse({ description: "User can't access this resource" })
@ApiUnauthorizedResponse({
  description: "User dont have the right to access this route",
})
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("me")
  @ApiResponse({
    status: 200,
    description: "User preferences",
    type: PreferenceDto,
  })
  async findMine(
    @Request() { user }: RequestWithUserPayload,
  ): Promise<PreferenceDto> {
    return this.preferenceService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("me")
  @ApiResponse({
    status: 200,
    description: "Updated preferences",
    type: PreferenceDto,
  })
  @ApiBody({
    description: "Preference to update",
    type: PreferenceDto,
  })
  async update(
    @Body() preference: PreferenceDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<PreferenceDto> {
    return this.preferenceService.update(user, preference);
  }
}
