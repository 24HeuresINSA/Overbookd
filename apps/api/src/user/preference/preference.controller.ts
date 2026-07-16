import {
  Body,
  Controller,
  Delete,
  Get,
  ParseEnumPipe,
  Patch,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { PreferenceService } from "./preference.service";
import { PlanningPreferenceDto } from "./dto/planning-preference.dto";
import { Permissions } from "../../authentication-zitadel/decorators/permissions-auth.decorator";
import { SET_FAVORITE_PAGES } from "@overbookd/permission";
import { PagesPreferenceResponseDto } from "./dto/pages-preference.response.dto";
import { AddPageToFavoritesRequestDto } from "./dto/add-page-to-favorites.request.dto";
import { PreferenceResponseDto } from "./dto/preference.response.dto";
import { pagesURL, PageURL } from "@overbookd/web-page";
import { AssignmentPreferenceDto } from "./dto/assignment-preference.dto";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";
import { AuthenticatedUser } from "../../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../../authentication-zitadel/request-hydrated-user";

@Controller("preferences")
@ApiTags("preferences")
@ApiBearerAuth()
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
    @AuthenticatedUser() user: RequestHydratedUser,
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
    @AuthenticatedUser() user: RequestHydratedUser,
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<AssignmentPreferenceDto> {
    return this.preferenceService.updateAssignmentPreference(
      user.id,
      preference,
    );
  }

  @Patch("me/favorite-pages")
  @Permissions(SET_FAVORITE_PAGES)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<PagesPreferenceResponseDto> {
    return this.preferenceService.addPageToFavorites(user.id, page);
  }

  @Delete("me/favorite-pages")
  @Permissions(SET_FAVORITE_PAGES)
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
    @AuthenticatedUser() user: RequestHydratedUser,
    @Query("page", new ParseEnumPipe(pagesURL)) page: PageURL,
  ): Promise<PagesPreferenceResponseDto> {
    return this.preferenceService.removePageFromFavorites(user.id, page);
  }
}
