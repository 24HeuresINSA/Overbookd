import { Controller, Sse } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DomainEvent } from "@overbookd/domain-events";
import { Observable } from "rxjs";
import { LiveNotificationService } from "./live-notification.service";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { AuthenticatedUser } from "../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";
import { SseAuth } from "../authentication-zitadel/decorators/sse-auth.decorator";

@Controller("live-notifications")
@ApiTags("live-notifications")
@ApiSwaggerResponse()
export class LiveNotificationController {
  constructor(private readonly live: LiveNotificationService) {}

  @Sse("stream")
  @SseAuth()
  mine(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Observable<DomainEvent> {
    return this.live.all(user);
  }
}
