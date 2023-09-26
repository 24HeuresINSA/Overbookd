import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AlertService } from "./alert.service";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { RequestWithUserPayload } from "../app.controller";
import { AlertResponseDto } from "./dto/alert.response.dto";

@ApiTags("alerts")
@ApiBearerAuth()
@ApiBadGatewayResponse({ description: "Bad Request" })
@ApiForbiddenResponse({
  description: "User is not allowed to access this resource.",
})
@Controller("alerts")
export class AlertController {
  constructor(private readonly alert: AlertService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Volunteer's alerts",
    type: AlertResponseDto,
    isArray: true,
  })
  getAlerts(@Request() request: RequestWithUserPayload) {
    return this.alert.getMyAlerts(request.user);
  }
}
