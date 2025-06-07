import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
  Get,
  Param,
  ParseIntPipe,
  UseFilters,
  HttpCode,
  Delete,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiBody,
  getSchemaPath,
  ApiExtraModels,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { OFFER_SHARED_MEAL, SHOTGUN_SHARED_MEAL } from "@overbookd/permission";
import { SharedMealService } from "./shared-meal.service";
import { RequestWithUserPayload } from "../app.controller";
import { OfferMealRequestDto } from "./dto/offer-meal.request.dto";
import {
  OnGoingSharedMealResponseDto,
  PastSharedMealResponseDto,
} from "./dto/shared-meal.response.dto";
import {
  Adherent,
  PastSharedMeal,
  SharedMeal,
} from "@overbookd/personal-account";
import { MealSharingErrorFilter } from "./filter/meal-sharing.filter";
import { RecordExpenseRequestDto } from "./dto/record-expense.request.dto";
import { SharedMealErrorFilter } from "./filter/shared-meal.filter";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@ApiTags("shared-meals")
@Controller("shared-meals")
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@UseFilters(MealSharingErrorFilter, SharedMealErrorFilter)
@ApiExtraModels(OnGoingSharedMealResponseDto, PastSharedMealResponseDto)
@ApiSwaggerResponse()
export class SharedMealController {
  constructor(private readonly sharedMeal: SharedMealService) {}

  @Post()
  @Permission(OFFER_SHARED_MEAL)
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

  @Get()
  @Permission(SHOTGUN_SHARED_MEAL)
  @ApiResponse({
    status: 200,
    description: "Meals available",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(OnGoingSharedMealResponseDto) },
        { $ref: getSchemaPath(PastSharedMealResponseDto) },
      ],
    },
    isArray: true,
  })
  allMeals(): Promise<SharedMeal[]> {
    return this.sharedMeal.all();
  }

  @Get(":mealId")
  @Permission(SHOTGUN_SHARED_MEAL)
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

  @Post(":mealId/shotgun")
  @Permission(SHOTGUN_SHARED_MEAL)
  @HttpCode(200)
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

  @Post(":mealId/expense")
  @Permission(OFFER_SHARED_MEAL)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Expense recorded and shared meal closed",
    type: PastSharedMealResponseDto,
  })
  @ApiParam({
    name: "mealId",
    type: Number,
    required: true,
  })
  @ApiBody({ type: RecordExpenseRequestDto })
  recordExpense(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() expense: RecordExpenseRequestDto,
  ): Promise<PastSharedMeal> {
    return this.sharedMeal.recordExpense(mealId, user, expense);
  }

  @Delete(":mealId/shotgun/:guestId")
  @Permission(SHOTGUN_SHARED_MEAL)
  @HttpCode(200)
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
  @ApiParam({
    name: "guestId",
    type: Number,
    required: true,
  })
  cancelMealShotgun(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @Param("guestId", ParseIntPipe) guestId: Adherent["id"],
    @Request() { user }: RequestWithUserPayload,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.cancelShotgun(mealId, guestId, user.id);
  }

  @Delete(":mealId")
  @Permission(SHOTGUN_SHARED_MEAL)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
  })
  @ApiParam({
    name: "mealId",
    type: Number,
    required: true,
  })
  cancelMeal(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @Request() { user }: RequestWithUserPayload,
  ): Promise<void> {
    return this.sharedMeal.cancelMeal(mealId, user.id);
  }

  @Post(":mealId/close-shotguns")
  @Permission(OFFER_SHARED_MEAL)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Updated meal details",
    type: OnGoingSharedMealResponseDto,
  })
  @ApiParam({
    name: "mealId",
    type: Number,
    required: true,
  })
  closeShotguns(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @Request() { user }: RequestWithUserPayload,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.closeShotguns(mealId, user.id);
  }

  @Post(":mealId/open-shotguns")
  @Permission(OFFER_SHARED_MEAL)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Updated meal details",
    type: OnGoingSharedMealResponseDto,
  })
  @ApiParam({
    name: "mealId",
    type: Number,
    required: true,
  })
  openShotguns(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @Request() { user }: RequestWithUserPayload,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.openShotguns(mealId, user.id);
  }
}
