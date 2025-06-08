import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AlertService } from "./alert.service";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { RequestWithUserPayload } from "../app.controller";
import { AlertsResponseDto } from "./dto/alerts.response.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("alerts")
@ApiTags("alerts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiSwaggerResponse()
export class AlertController {
  constructor(private readonly alert: AlertService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Volunteer's alerts",
    type: AlertsResponseDto,
  })
  getAlerts(@Request() request: RequestWithUserPayload) {
    return this.alert.getMyAlerts(request.user);
  }
}
