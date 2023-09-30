import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
  controllers: [NotificationController],
  providers: [{ provide: NotificationService, useClass: NotificationService }],
})
export class NotificationModule {}
