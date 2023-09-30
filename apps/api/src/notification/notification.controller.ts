import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { RequestWithUserPayload } from "../app.controller";

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
    type: Boolean,
  })
  hasNotifications(@Request() { user }: RequestWithUserPayload) {
    return this.notify.hasNotifications(user);
  }
}
