import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { GearRequestResponseDto } from "./dto/gear-request.response.dto";
import { GearRequestService } from "./gear-request.service";

@ApiBearerAuth()
@ApiTags("gear-requests")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("gear-requests")
export class GearRequestController {
  constructor(private readonly gearRequestService: GearRequestService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("write-inventory")
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all events gear requests",
    isArray: true,
    type: GearRequestResponseDto,
  })
  getAll(): Promise<GearRequestResponseDto[]> {
    return this.gearRequestService.getAllRequests();
  }
}
