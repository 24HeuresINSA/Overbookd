import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { MANAGE_PERSONAL_ACCOUNTS } from "@overbookd/permission";
import { PersonalAccountService } from "./personal-account.service";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { BarrelPricesResponseDto } from "./dto/barrel-prices.response.dto";
import { BarrelPricesRequestDto } from "./dto/barrel-prices.request.dto";

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
export class PersonalAccountController {
  constructor(
    private readonly personalAccountService: PersonalAccountService,
  ) {}

  @Permission(MANAGE_PERSONAL_ACCOUNTS)
  @Post("barrel-prices")
  @ApiResponse({
    status: 201,
    description: "Upate barrel prices configuration",
    type: BarrelPricesResponseDto,
  })
  async updateBarrelPrices(
    @Body() prices: BarrelPricesRequestDto,
  ): Promise<BarrelPricesResponseDto> {
    return this.personalAccountService.saveBarrelPrices(prices);
  }
}
