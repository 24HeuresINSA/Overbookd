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
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
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
import { PastSharedMeal, SharedMeal } from "@overbookd/personal-account";
import { MealSharingErrorFilter } from "./filter/meal-sharing.filter";
import { RecordExpenseRequestDto } from "./dto/record-expense.request.dto";
import { SharedMealErrorFilter } from "./filter/shared-meal.filter";

@ApiTags("shared-meals")
@Controller("shared-meals")
@UseFilters(MealSharingErrorFilter, SharedMealErrorFilter)
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@ApiExtraModels(OnGoingSharedMealResponseDto, PastSharedMealResponseDto)
export class SharedMealController {
  constructor(private readonly sharedMeal: SharedMealService) {}

  @Permission(OFFER_SHARED_MEAL)
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

  @Permission(SHOTGUN_SHARED_MEAL)
  @Get("")
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

  @Permission(SHOTGUN_SHARED_MEAL)
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

  @Permission(SHOTGUN_SHARED_MEAL)
  @Post(":mealId/shotgun")
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

  @Permission(OFFER_SHARED_MEAL)
  @Post(":mealId/expense")
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
}
