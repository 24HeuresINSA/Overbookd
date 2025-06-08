import {
  ApiBearerAuth,
  ApiBody,
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
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@Controller("logistic/purchases")
@ApiTags("logistic/purchases")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(LogisticErrorFilter)
@ApiSwaggerResponse()
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  @Permission(PURCHASE_GEARS)
  @ApiResponse({
    status: 200,
    description: "All purchases",
    type: PurchaseResponseDto,
    isArray: true,
  })
  findAll(): Promise<Purchase[]> {
    return this.purchaseService.findAll();
  }

  @Get(":id")
  @Permission(PURCHASE_GEARS)
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

  @Post()
  @Permission(PURCHASE_GEARS)
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

  @Patch(":id")
  @Permission(PURCHASE_GEARS)
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

  @Delete(":id")
  @Permission(PURCHASE_GEARS)
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

  @Post(":id/gear-requests")
  @Permission(PURCHASE_GEARS)
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

  @Delete(":id/gear-requests/:slug")
  @Permission(PURCHASE_GEARS)
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
