import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  MANAGE_PERSONAL_ACCOUNTS,
  HAVE_PERSONAL_ACCOUNT,
} from "@overbookd/permission";
import { PersonalAccountService } from "./personal-account.service";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { BarrelPricesResponseDto } from "./dto/barrel-prices.response.dto";
import { BarrelPricesRequestDto } from "./dto/barrel-prices.request.dto";
import { BarrelResponseDto } from "./dto/barrel.response.dto";
import { AdjustBarrelPriceRequestDto } from "./dto/adjust-barrel-price.request.dto";
import { CreateBarrelRequestDto } from "./dto/create-barrel.request.dto";
import {
  BarrelNotConfiguredFilter,
  SimilarBarrelExistFilter,
} from "./personal-account-error.filter";

@ApiTags("personal-account")
@Controller("personal-account")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@UseFilters(new SimilarBarrelExistFilter(), new BarrelNotConfiguredFilter())
export class PersonalAccountController {
  constructor(
    private readonly personalAccountService: PersonalAccountService,
  ) {}

  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Post("barrel-prices")
  @ApiResponse({
    status: 201,
    description: "Update barrel prices configuration",
    type: BarrelPricesResponseDto,
  })
  async updateBarrelPrices(
    @Body() prices: BarrelPricesRequestDto,
  ): Promise<BarrelPricesResponseDto> {
    return this.personalAccountService.saveBarrelPrices(prices);
  }

  @Permission(HAVE_PERSONAL_ACCOUNT)
  @Get("barrel-prices")
  @ApiResponse({
    status: 200,
    description: "All configured barrel prices",
    type: BarrelPricesResponseDto,
  })
  async getBarrelPrices(): Promise<BarrelPricesResponseDto> {
    return this.personalAccountService.getBarrelPrices();
  }

  @Permission(HAVE_PERSONAL_ACCOUNT)
  @Get("barrels")
  @ApiResponse({
    status: 200,
    description: "All configured barrels",
    isArray: true,
    type: BarrelResponseDto,
  })
  async getBarrels(): Promise<BarrelResponseDto[]> {
    return this.personalAccountService.getBarrels();
  }

  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Post("barrels")
  @ApiResponse({
    status: 201,
    description: "Configured barrel created",
    type: BarrelResponseDto,
  })
  async createBarrel(
    @Body() barrel: CreateBarrelRequestDto,
  ): Promise<BarrelResponseDto> {
    return this.personalAccountService.createBarrel(barrel);
  }

  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @ApiNotFoundResponse({
    description: "Can't find barrel matching requested slug",
  })
  @Patch("barrels/:slug")
  @ApiResponse({
    status: 200,
    description: "Configured barrel updated",
    type: BarrelResponseDto,
  })
  @ApiParam({
    name: "slug",
    type: String,
    description: "Barrel slug",
    required: true,
  })
  async updateBarrel(
    @Param("slug") slug: string,
    @Body() adjustment: AdjustBarrelPriceRequestDto,
  ): Promise<BarrelResponseDto> {
    return this.personalAccountService.adjustPrice(slug, adjustment.price);
  }

  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Delete("barrels/:slug")
  @ApiResponse({
    status: 204,
    description: "Barrel removed",
  })
  @ApiParam({
    name: "slug",
    type: String,
    description: "Barrel slug",
    required: true,
  })
  async removeBarrel(@Param("slug") slug: string): Promise<void> {
    return this.personalAccountService.removeBarrel(slug);
  }
}
