import { Controller, Delete, Get, Request, UseGuards } from "@nestjs/common";
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RequestWithUserPayload } from "../app.controller";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { NotificationsResponseDto } from "./dto/notifications.response.dto";
import { NotificationService } from "./notification.service";

@ApiTags("notifications")
@ApiBearerAuth()
@ApiBadGatewayResponse({ description: "Bad Request" })
@ApiForbiddenResponse({
  description: "User is not allowed to access this resource.",
})
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notify: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Volunteer's notifications",
    type: NotificationsResponseDto,
  })
  hasNotifications(@Request() { user }: RequestWithUserPayload) {
    return this.notify.hasNotifications(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiResponse({
    status: 204,
    description: "Volunteer's notifications set as red",
  })
  readNotification(@Request() { user }: RequestWithUserPayload) {
    return this.notify.readNotification(user.id);
  }
}
