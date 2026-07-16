import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AlertService } from "./alert.service";
import { AlertsResponseDto } from "./dto/alerts.response.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { AuthenticatedUser } from "../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

@Controller("alerts")
@ApiTags("alerts")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class AlertController {
  constructor(private readonly alert: AlertService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Volunteer's alerts",
    type: AlertsResponseDto,
  })
  getAlerts(@AuthenticatedUser() user: RequestHydratedUser) {
    return this.alert.getMyAlerts(user);
  }
}
