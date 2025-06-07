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

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags("logistic/borrows")
@Controller("logistic/borrows")
@UseFilters(LogisticErrorFilter)
@ApiSwaggerResponse()
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Permission(BORROW_GEARS)
  @Get()
  @ApiResponse({
    status: 200,
    description: "All borrows",
    type: BorrowResponseDto,
    isArray: true,
  })
  findAll(): Promise<Borrow[]> {
    return this.borrowService.findAll();
  }

  @Permission(BORROW_GEARS)
  @Get(":id")
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

  @Permission(BORROW_GEARS)
  @Post()
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

  @Permission(BORROW_GEARS)
  @Patch(":id")
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

  @Permission(BORROW_GEARS)
  @Delete(":id")
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

  @Permission(BORROW_GEARS)
  @Post(":id/gear-requests")
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

  @Permission(BORROW_GEARS)
  @Delete(":id/gear-requests/:slug")
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
