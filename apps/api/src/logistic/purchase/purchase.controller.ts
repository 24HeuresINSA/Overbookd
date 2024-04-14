import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LogisticErrorFilter } from "../logistic.filter";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PURCHASE_GEARS } from "@overbookd/permission";
import { Purchase } from "@overbookd/logistic";
import { PurchaseResponseDto } from "./dto/purchase.response.dto";
import { InitPurchaseRequestDto } from "./dto/init-purchase.request.dto";
import { PlanPurchaseRequestDto } from "./dto/plan-purchase.request.dto";
import { AddGearRequestForm } from "@overbookd/http";
import { AddGearRequestDto } from "../common/dto/add-gear.request.dto";

@ApiBearerAuth()
@ApiTags("logistic/purchases")
@Controller("logistic/purchases")
@UseFilters(LogisticErrorFilter)
@ApiBadRequestResponse({ description: "Request is not formated as expected" })
@ApiForbiddenResponse({ description: "User can't access this resource" })
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(PURCHASE_GEARS)
  @Get()
  @ApiResponse({
    status: 200,
    description: "All purchases",
    type: PurchaseResponseDto,
    isArray: true,
  })
  findAll(): Promise<Purchase[]> {
    return this.purchaseService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(PURCHASE_GEARS)
  @Get(":id")
  @ApiParam({
    name: "id",
    type: Number,
    description: "Purchase id to find",
  })
  @ApiResponse({
    status: 200,
    description: "Found purchase",
    type: PurchaseResponseDto,
  })
  findOne(@Param("id", ParseIntPipe) id: Purchase["id"]): Promise<Purchase> {
    return this.purchaseService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(PURCHASE_GEARS)
  @Post()
  @ApiBody({
    description: "Purchase to initialize",
    type: InitPurchaseRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: "Initialized purchase",
    type: PurchaseResponseDto,
  })
  initPurchase(@Body() purchase: InitPurchaseRequestDto): Promise<Purchase> {
    return this.purchaseService.initPurchase(purchase);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(PURCHASE_GEARS)
  @Patch(":id")
  @ApiParam({
    name: "id",
    type: Number,
    description: "Purchase id to plan",
  })
  @ApiBody({
    description: "Purchase to plan",
    type: PlanPurchaseRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "Planned purchase",
    type: PurchaseResponseDto,
  })
  planPurchase(
    @Param("id", ParseIntPipe) id: Purchase["id"],
    @Body() purchase: PlanPurchaseRequestDto,
  ): Promise<Purchase> {
    return this.purchaseService.planPurchase(id, purchase);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(PURCHASE_GEARS)
  @Delete(":id")
  @HttpCode(204)
  @ApiParam({
    name: "id",
    type: Number,
    description: "Purchase id to remove",
  })
  @ApiResponse({
    status: 204,
    description: "removed purchase",
  })
  cancelPurchase(@Param("id", ParseIntPipe) id: Purchase["id"]): Promise<void> {
    return this.purchaseService.cancelPurchase(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(PURCHASE_GEARS)
  @Post(":id/gear-requests")
  @ApiParam({
    name: "id",
    type: Number,
    description: "Purchase id to plan",
  })
  @ApiBody({
    description: "Gear to add",
    type: AddGearRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "Planned purchase",
    type: PurchaseResponseDto,
  })
  addGear(
    @Param("id", ParseIntPipe) id: Purchase["id"],
    @Body() { slug, quantity }: AddGearRequestForm,
  ): Promise<Purchase> {
    return this.purchaseService.addGear(id, slug, quantity);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(PURCHASE_GEARS)
  @Delete(":id/gear-requests/:slug")
  @ApiParam({
    name: "id",
    type: Number,
    description: "Purchase id to plan",
  })
  @ApiParam({
    name: "slug",
    type: String,
    description: "Gear slug to remove",
  })
  @ApiResponse({
    status: 200,
    description: "Planned purchase",
    type: PurchaseResponseDto,
  })
  removeGear(
    @Param("id", ParseIntPipe) id: Purchase["id"],
    @Param("slug") slug: AddGearRequestForm["slug"],
  ): Promise<Purchase> {
    return this.purchaseService.removeGear(id, slug);
  }
}
