import { Controller, Delete, Get, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NotificationsResponseDto } from "./dto/notifications.response.dto";
import { NotificationService } from "./notification.service";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { AuthenticatedUser } from "../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

@Controller("notifications")
@ApiTags("notifications")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class NotificationController {
  constructor(private readonly notify: NotificationService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Volunteer's notifications",
    type: NotificationsResponseDto,
  })
  hasNotifications(@AuthenticatedUser() user: RequestHydratedUser) {
    return this.notify.hasNotifications(user.id);
  }

  @Delete()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Volunteer's notifications set as red",
  })
  readNotification(@AuthenticatedUser() user: RequestHydratedUser) {
    return this.notify.readNotification(user.id);
  }
}
