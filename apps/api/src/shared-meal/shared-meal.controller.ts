import {
  Controller,
  Post,
  Body,
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
import { Permissions } from "../authentication-zitadel/decorators/permissions-auth.decorator";
import {
  MANAGE_SHARED_MEALS,
  OFFER_SHARED_MEAL,
  SHOTGUN_SHARED_MEAL,
} from "@overbookd/permission";
import { SharedMealService } from "./shared-meal.service";
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
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";
import { AuthenticatedUser } from "../authentication-zitadel/decorators/authenticated-user.decorator";

@Controller("shared-meals")
@ApiTags("shared-meals")
@UseFilters(MealSharingErrorFilter)
@ApiBearerAuth()
@ApiSwaggerResponse()
@ApiExtraModels(OnGoingSharedMealResponseDto, PastSharedMealResponseDto)
export class SharedMealController {
  constructor(private readonly sharedMeal: SharedMealService) {}

  @Post()
  @Permissions(OFFER_SHARED_MEAL)
  @ApiResponse({
    status: 201,
    description: "Newly available shared meal",
    type: OnGoingSharedMealResponseDto,
  })
  @ApiBody({ type: OfferMealRequestDto })
  offerMeal(
    @Body() meal: OfferMealRequestDto,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.offer(meal, user.id);
  }

  @Get()
  @Permissions(MANAGE_SHARED_MEALS)
  @ApiResponse({
    status: 200,
    description: "All shared meals",
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

  @Get("on-going")
  @Permissions(SHOTGUN_SHARED_MEAL)
  @ApiResponse({
    status: 200,
    description: "Shared meals available",
    type: OnGoingSharedMealResponseDto,
    isArray: true,
  })
  allOnGoingMeals(): Promise<OnGoingSharedMealResponseDto[]> {
    return this.sharedMeal.allOnGoing();
  }

  @Get("past")
  @Permissions(MANAGE_SHARED_MEALS)
  @ApiResponse({
    status: 200,
    description: "Past shared meals",
    type: PastSharedMealResponseDto,
    isArray: true,
  })
  allPastMeals(): Promise<PastSharedMealResponseDto[]> {
    return this.sharedMeal.allPast();
  }

  @Get("past/mine")
  @Permissions(OFFER_SHARED_MEAL)
  @ApiResponse({
    status: 200,
    description: "Shared meals the user was part of",
    type: PastSharedMealResponseDto,
    isArray: true,
  })
  myPastMeals(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<PastSharedMealResponseDto[]> {
    return this.sharedMeal.pastWithAdherent(user.id);
  }

  @Post(":mealId/shotgun")
  @Permissions(SHOTGUN_SHARED_MEAL)
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
  shotgunMealPortion(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.addPortion(mealId, user.id);
  }

  @Post(":mealId/shotgun/:guestId/remove-portion")
  @Permissions(OFFER_SHARED_MEAL)
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
  unshotgunMealPortion(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @Param("guestId", ParseIntPipe) guestId: Adherent["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.removePortion(mealId, guestId, user.id);
  }

  @Delete(":mealId/shotgun/:guestId")
  @Permissions(OFFER_SHARED_MEAL)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.cancelShotgun(mealId, guestId, user.id);
  }

  @Post(":mealId/expense")
  @Permissions(OFFER_SHARED_MEAL)
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
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() expense: RecordExpenseRequestDto,
  ): Promise<PastSharedMeal> {
    return this.sharedMeal.recordExpense(mealId, user.id, expense);
  }

  @Delete(":mealId")
  @Permissions(OFFER_SHARED_MEAL)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<void> {
    return this.sharedMeal.cancelMeal(mealId, user.id);
  }

  @Post(":mealId/close-shotguns")
  @Permissions(OFFER_SHARED_MEAL)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.closeShotguns(mealId, user.id);
  }

  @Post(":mealId/open-shotguns")
  @Permissions(OFFER_SHARED_MEAL)
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
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.openShotguns(mealId, user.id);
  }

  @Post(":mealId/allow-multiple-shotguns")
  @Permissions(OFFER_SHARED_MEAL)
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
  allowMultipleShotguns(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.allowMultipleShotguns(mealId, user.id);
  }

  @Post(":mealId/disallow-multiple-shotguns")
  @Permissions(OFFER_SHARED_MEAL)
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
  disallowMultipleShotguns(
    @Param("mealId", ParseIntPipe) mealId: SharedMeal["id"],
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<OnGoingSharedMealResponseDto> {
    return this.sharedMeal.disallowMultipleShotguns(mealId, user.id);
  }
}
