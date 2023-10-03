import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import {
  Controller,
  Delete,
  Get,
  MessageEvent,
  Query,
  Request,
  Sse,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { RequestWithUserPayload } from "../app.controller";
import { Observable } from "rxjs";

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
    return this.notify.hasNotifications(user.id);
  }

  @Sse("live")
  liveNotification(
    @Query() { token }: { token: string },
  ): Observable<MessageEvent> {
    return this.notify.inLive(token);
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
