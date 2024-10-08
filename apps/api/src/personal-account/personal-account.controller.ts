import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { BarrelResponseDto } from "./dto/barrel.response.dto";
import { AdjustBarrelPriceRequestDto } from "./dto/adjust-barrel-price.request.dto";
import { CreateBarrelRequestDto } from "./dto/create-barrel.request.dto";
import {
  BarrelNotConfiguredFilter,
  SimilarBarrelExistFilter,
} from "./personal-account-error.filter";
import { AdjustBarrelOpeningDateRequestDto } from "./dto/adjust-barrel-opening-date.request.dto";

@ApiTags("personal-account")
@Controller("personal-account")
@ApiBadRequestResponse({ description: "Request is not formated as expected" })
@ApiForbiddenResponse({ description: "User can't access this resource" })
@ApiNotFoundResponse({ description: "Can't find barrel" })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@UseFilters(new SimilarBarrelExistFilter(), new BarrelNotConfiguredFilter())
export class PersonalAccountController {
  constructor(
    private readonly personalAccountService: PersonalAccountService,
  ) {}

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
  @Patch("barrels/:slug/price")
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
  async adjustBarrelPrice(
    @Param("slug") slug: string,
    @Body() adjustment: AdjustBarrelPriceRequestDto,
  ): Promise<BarrelResponseDto> {
    return this.personalAccountService.adjustPrice(slug, adjustment.price);
  }

  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Patch("barrels/:slug/opening")
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
  async adjustBarrelOpening(
    @Param("slug") slug: string,
    @Body() adjustment: AdjustBarrelOpeningDateRequestDto,
  ): Promise<BarrelResponseDto> {
    return this.personalAccountService.adjustOpeningDate(
      slug,
      adjustment.openedOn,
    );
  }

  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Delete("barrels/:slug")
  @HttpCode(204)
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
