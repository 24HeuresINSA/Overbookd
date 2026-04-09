import {
  Body,
  Controller,
  Delete,
  Get,
  ParseEnumPipe,
  Patch,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SET_FAVORITE_PAGES } from "@overbookd/permission";
import { pagesURL, PageURL } from "@overbookd/web-page";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";
import { RequestWithUserPayload } from "../../app.controller";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { AddPageToFavoritesRequestDto } from "./dto/add-page-to-favorites.request.dto";
import { AssignmentPreferenceDto } from "./dto/assignment-preference.dto";
import { PagesPreferenceResponseDto } from "./dto/pages-preference.response.dto";
import { PlanningPreferenceDto } from "./dto/planning-preference.dto";
import { PreferenceResponseDto } from "./dto/preference.response.dto";
import { PreferenceService } from "./preference.service";

@Controller("preferences")
@ApiTags("preferences")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiSwaggerResponse()
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Get("me")
  @ApiResponse({
    status: 200,
    description: "User preferences",
    type: PreferenceResponseDto,
  })
  findMine(
    @Request() { user }: RequestWithUserPayload,
  ): Promise<PreferenceResponseDto> {
    return this.preferenceService.findOne(user.id);
  }

  @Patch("me/planning")
  @ApiResponse({
    status: 200,
    description: "Updated planning preferences",
    type: PlanningPreferenceDto,
  })
  @ApiBody({
    description: "Planning preference to update",
    type: PlanningPreferenceDto,
  })
  updatePlanningPreference(
    @Body() preference: PlanningPreferenceDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<PlanningPreferenceDto> {
    return this.preferenceService.updatePlanningPreference(user.id, preference);
  }

  @Patch("me/assignment")
  @ApiResponse({
    status: 200,
    description: "Updated assignment preference",
    type: AssignmentPreferenceDto,
  })
  @ApiBody({
    description: "Assignment preference to update",
    type: AssignmentPreferenceDto,
  })
  updateAssignmentPreference(
    @Body() preference: AssignmentPreferenceDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<AssignmentPreferenceDto> {
    return this.preferenceService.updateAssignmentPreference(
      user.id,
      preference,
    );
  }

  @Patch("me/favorite-pages")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(SET_FAVORITE_PAGES)
  @ApiResponse({
    status: 200,
    description: "Updated favorite pages",
    type: PagesPreferenceResponseDto,
  })
  @ApiBody({
    description: "Page to add to favorite",
    type: AddPageToFavoritesRequestDto,
  })
  addPageToFavorites(
    @Body() { page }: AddPageToFavoritesRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<PagesPreferenceResponseDto> {
    return this.preferenceService.addPageToFavorites(user.id, page);
  }

  @Delete("me/favorite-pages")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(SET_FAVORITE_PAGES)
  @ApiResponse({
    status: 200,
    description: "Updated favorite pages",
    type: PagesPreferenceResponseDto,
  })
  @ApiQuery({
    name: "page",
    description: "Page to remove from favorite",
    enum: pagesURL,
  })
  removePageFromFavorites(
    @Request() { user }: RequestWithUserPayload,
    @Query("page", new ParseEnumPipe(pagesURL)) page: PageURL,
  ): Promise<PagesPreferenceResponseDto> {
    return this.preferenceService.removePageFromFavorites(user.id, page);
  }
}
