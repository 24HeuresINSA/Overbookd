import { Controller, Query, Sse } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DomainEvent } from "@overbookd/domain-events";
import { Observable } from "rxjs";
import { LiveNotificationService } from "./live-notification.service";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@ApiBearerAuth()
@ApiTags("live-notifications")
@Controller("live-notifications")
@ApiSwaggerResponse()
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
