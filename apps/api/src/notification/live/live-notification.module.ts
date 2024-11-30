import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../authentication/jwt-constants";
import { DomainEventModule } from "../../domain-event/domain-event.module";
import { DomainEventService } from "../../domain-event/domain-event.service";
import { LiveNotificationService } from "./live-notification.service";

@Module({
  providers: [
    {
      provide: LiveNotificationService,
      useFactory: (eventStore: DomainEventService, jwt: JwtService) => {
        return new LiveNotificationService(eventStore, jwt);
      },
      inject: [DomainEventService, JwtService],
    },
  ],
  imports: [
    DomainEventModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "24h" },
    }),
  ],
  exports: [LiveNotificationService],
})
export class LiveNotificationModule {}
