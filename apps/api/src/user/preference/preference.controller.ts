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
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { PreferenceService } from "./preference.service";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PlanningPreferenceDto } from "./dto/planning-preference.dto";
import { RequestWithUserPayload } from "../../app.controller";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { SET_FAVORITE_PAGES } from "@overbookd/permission";
import { PagesPreferenceResponseDto } from "./dto/pages-preference.response.dto";
import { AddPageToFavoritesRequestDto } from "./dto/add-page-to-favorites.request.dto";
import { PreferenceResponseDto } from "./dto/preference.response.dto";
import { pagesURL, PageURL } from "@overbookd/web-page";

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
    type: PreferenceResponseDto,
  })
  findMine(
    @Request() { user }: RequestWithUserPayload,
  ): Promise<PreferenceResponseDto> {
    return this.preferenceService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(SET_FAVORITE_PAGES)
  @Patch("me/favorite-pages")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(SET_FAVORITE_PAGES)
  @Delete("me/favorite-pages")
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
