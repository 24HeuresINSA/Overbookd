import { Controller, Query, Sse } from "@nestjs/common";
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DomainEvent } from "@overbookd/domain-events";
import { Observable } from "rxjs";
import { LiveNotificationService } from "./live-notification.service";

@ApiTags("notifications")
@ApiBearerAuth()
@ApiBadGatewayResponse({ description: "Bad Request" })
@ApiForbiddenResponse({
  description: "User is not allowed to access this resource.",
})
@Controller("live-notifications")
export class LiveNotificationController {
  constructor(private readonly live: LiveNotificationService) {}

  @Sse("mine")
  mine(@Query() { token }: { token: string }): Observable<DomainEvent> {
    return this.live.mine(token);
  }

  @Sse("festival-activities")
  festivalActivities(): Observable<DomainEvent> {
    return this.live.festivalActivities();
  }

  @Sse("festival-tasks")
  festivalTasks(): Observable<DomainEvent> {
    return this.live.festivalTasks();
  }
}
