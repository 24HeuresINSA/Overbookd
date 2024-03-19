import {
  Body,
  Controller,
  Delete,
  Get,
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
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { BorrowErrorFilter } from "./borrow.filter";
import { BorrowService } from "./borrow.service";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { READ_BORROW_SHEET, WRITE_BORROW_SHEET } from "@overbookd/permission";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { BorrowResponseDto } from "./dto/borrow.response.dto";
import { InitBorrowRequestDto } from "./dto/init-borrow.request.dto";
import { Borrow, GearRequest, InitBorrowForm } from "@overbookd/logistic";
import { AddGearRequestDto } from "./dto/add-gear.request.dto";
import { AddBorrowGearRequestForm } from "@overbookd/http";

@ApiBearerAuth()
@ApiTags("logistic/borrow")
@Controller("logistic/borrow")
@UseFilters(BorrowErrorFilter)
@ApiBadRequestResponse({ description: "Request is not formated as expected" })
@ApiForbiddenResponse({ description: "User can't access this resource" })
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_BORROW_SHEET)
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_BORROW_SHEET)
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_BORROW_SHEET)
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
  initBorrow(@Body() borrow: InitBorrowForm): Promise<Borrow> {
    return this.borrowService.initBorrow(borrow);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_BORROW_SHEET)
  @Patch(":id")
  @ApiParam({
    name: "id",
    type: Number,
    description: "Borrow id to plan",
  })
  @ApiBody({
    description: "Borrow to initialize",
    type: InitBorrowRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "Planned borrow",
    type: BorrowResponseDto,
  })
  planBorrow(
    @Param("id", ParseIntPipe) id: Borrow["id"],
    @Body() borrow: InitBorrowForm,
  ): Promise<Borrow> {
    return this.borrowService.planBorrow(id, borrow);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_BORROW_SHEET)
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
    @Body() { slug, quantity }: AddBorrowGearRequestForm,
  ): Promise<Borrow> {
    return this.borrowService.addGearRequest(id, slug, quantity);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_BORROW_SHEET)
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
