import { Controller, Query, Sse } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DomainEvent } from "@overbookd/domain-events";
import { Observable } from "rxjs";
import { LiveNotificationService } from "./live-notification.service";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@Controller("live-notifications")
@ApiTags("live-notifications")
@ApiSwaggerResponse()
export class LiveNotificationController {
  constructor(private readonly live: LiveNotificationService) {}

  @Sse("stream")
  mine(@Query() { token }: { token: string }): Observable<DomainEvent> {
    return this.live.all(token);
  }
}
