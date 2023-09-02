import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { DomainEventModule } from "../domain-event/domain-event.module";

@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [DomainEventModule],
})
export class MailModule {}
