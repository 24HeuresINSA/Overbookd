import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequestWithUserPayload } from "../app.controller";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { NotificationsResponseDto } from "./dto/notifications.response.dto";
import { NotificationService } from "./notification.service";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@ApiBearerAuth()
@ApiTags("notifications")
@Controller("notifications")
@ApiSwaggerResponse()
export class NotificationController {
  constructor(private readonly notify: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: "Volunteer's notifications",
    type: NotificationsResponseDto,
  })
  hasNotifications(@Request() { user }: RequestWithUserPayload) {
    return this.notify.hasNotifications(user.id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Volunteer's notifications set as red",
  })
  readNotification(@Request() { user }: RequestWithUserPayload) {
    return this.notify.readNotification(user.id);
  }
}
