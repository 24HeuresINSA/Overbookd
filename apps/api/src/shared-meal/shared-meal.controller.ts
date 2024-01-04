import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
  Get,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiBody,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { HAVE_PERSONAL_ACCOUNT } from "@overbookd/permission";
import { SharedMealService } from "./shared-meal.service";
import { RequestWithUserPayload } from "../app.controller";
import { OfferMealRequestDto } from "./dto/offer-meal.request.dto";
import { OnGoingSharedMealResponseDto } from "./dto/shared-meal.response.dto";
import { SharedMeal } from "@overbookd/personal-account";

@ApiTags("shared-meals")
@Controller("shared-meals")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class SharedMealController {
  constructor(private readonly sharedMeal: SharedMealService) {}

  @Permission(HAVE_PERSONAL_ACCOUNT)
  @Post()
  @ApiResponse({
    status: 201,
    description: "Newly available shared meal",
    type: OnGoingSharedMealResponseDto,
  })
  @ApiBody({ type: OfferMealRequestDto })
  offerMeal(
    @Body() meal: OfferMealRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.offer(meal, user);
  }

  @Permission(HAVE_PERSONAL_ACCOUNT)
  @Get("")
  @ApiResponse({
    status: 200,
    description: "Meals available",
    type: OnGoingSharedMealResponseDto,
    isArray: true,
  })
  allMeals(): Promise<OnGoingSharedMealResponseDto[]> {
    return this.sharedMeal.all();
  }

  @Permission(HAVE_PERSONAL_ACCOUNT)
  @Get(":mealId")
  @ApiResponse({
    status: 200,
    description: "Selected meal details",
    type: OnGoingSharedMealResponseDto,
  })
  @ApiParam({
    name: "mealId",
    type: Number,
    required: true,
  })
  displayMeal(@Param("mealId", ParseIntPipe) mealId: SharedMeal["id"]) {
    return this.sharedMeal.find(mealId);
  }

  @Permission(HAVE_PERSONAL_ACCOUNT)
  @Post(":mealId/shotgun")
  @ApiResponse({
    status: 200,
    description: "Selected meal details",
    type: OnGoingSharedMealResponseDto,
  })
  @ApiParam({
    name: "mealId",
    type: Number,
    required: true,
  })
  shotgunMeal(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @Request() { user }: RequestWithUserPayload,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.shotgun(mealId, user.id);
  }
}
