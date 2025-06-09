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
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { LogisticErrorFilter } from "../logistic.filter";
import { BorrowService } from "./borrow.service";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { BORROW_GEARS } from "@overbookd/permission";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { BorrowResponseDto } from "./dto/borrow.response.dto";
import { InitBorrowRequestDto } from "./dto/init-borrow.request.dto";
import { Borrow, GearRequest } from "@overbookd/logistic";
import { AddGearRequestDto } from "../common/dto/add-gear.request.dto";
import { AddGearRequestForm } from "@overbookd/http";
import { PlanBorrowRequestDto } from "./dto/plan-borrow.request.dto";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@Controller("logistic/borrows")
@ApiTags("logistic/borrows")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(LogisticErrorFilter)
@ApiSwaggerResponse()
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Get()
  @Permission(BORROW_GEARS)
  @ApiResponse({
    status: 200,
    description: "All borrows",
    type: BorrowResponseDto,
    isArray: true,
  })
  findAll(): Promise<Borrow[]> {
    return this.borrowService.findAll();
  }

  @Get(":id")
  @Permission(BORROW_GEARS)
  @ApiParam({
    name: "id",
    type: Number,
    description: "Borrow id to find",
  })
  @ApiResponse({
    status: 200,
    description: "Found borrow",
    type: BorrowResponseDto,
  })
  findOne(@Param("id", ParseIntPipe) id: Borrow["id"]): Promise<Borrow> {
    return this.borrowService.findOne(id);
  }

  @Post()
  @Permission(BORROW_GEARS)
  @ApiBody({
    description: "Borrow to initialize",
    type: InitBorrowRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "Initialized borrow",
    type: BorrowResponseDto,
  })
  initBorrow(@Body() borrow: InitBorrowRequestDto): Promise<Borrow> {
    return this.borrowService.initBorrow(borrow);
  }

  @Patch(":id")
  @Permission(BORROW_GEARS)
  @ApiParam({
    name: "id",
    type: Number,
    description: "Borrow id to plan",
  })
  @ApiBody({
    description: "Borrow to plan",
    type: PlanBorrowRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "Planned borrow",
    type: BorrowResponseDto,
  })
  planBorrow(
    @Param("id", ParseIntPipe) id: Borrow["id"],
    @Body() borrow: PlanBorrowRequestDto,
  ): Promise<Borrow> {
    return this.borrowService.planBorrow(id, borrow);
  }

  @Delete(":id")
  @Permission(BORROW_GEARS)
  @HttpCode(204)
  @ApiParam({
    name: "id",
    type: Number,
    description: "Borrow id to remove",
  })
  @ApiResponse({
    status: 204,
    description: "Removed borrow",
  })
  cancelBorrow(@Param("id", ParseIntPipe) id: Borrow["id"]): Promise<void> {
    return this.borrowService.cancelBorrow(id);
  }

  @Post(":id/gear-requests")
  @Permission(BORROW_GEARS)
  @ApiParam({
    name: "id",
    type: Number,
    description: "Borrow id to plan",
  })
  @ApiBody({
    description: "Gear to add",
    type: AddGearRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "Planned borrow",
    type: BorrowResponseDto,
  })
  addGearRequest(
    @Param("id", ParseIntPipe) id: Borrow["id"],
    @Body() { slug, quantity }: AddGearRequestForm,
  ): Promise<Borrow> {
    return this.borrowService.addGearRequest(id, slug, quantity);
  }

  @Delete(":id/gear-requests/:slug")
  @Permission(BORROW_GEARS)
  @ApiParam({
    name: "id",
    type: Number,
    description: "Borrow id to plan",
  })
  @ApiParam({
    name: "slug",
    type: String,
    description: "Gear slug to remove",
  })
  @ApiResponse({
    status: 200,
    description: "Planned borrow",
    type: BorrowResponseDto,
  })
  removeGearRequest(
    @Param("id", ParseIntPipe) id: Borrow["id"],
    @Param("slug") slug: GearRequest["slug"],
  ): Promise<Borrow> {
    return this.borrowService.removeGearRequest(id, slug);
  }
}
