import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { MailerService } from "@nestjs-modules/mailer";
import { DomainEventService } from "../domain-event/domain-event.service";
import { PrismaMembers } from "./repository/members.prisma";
import { PrismaService } from "../prisma.service";
import { PrismaModule } from "../prisma.module";

@Module({
  providers: [
    {
      provide: PrismaMembers,
      useFactory: (prisma: PrismaService) => new PrismaMembers(prisma),
      inject: [PrismaService],
    },
    {
      provide: MailService,
      useFactory: (
        mailer: MailerService,
        eventStore: DomainEventService,
        members: PrismaMembers,
      ) => new MailService(mailer, eventStore, members),
      inject: [MailerService, DomainEventService, PrismaMembers],
    },
  ],
  exports: [MailService],
  imports: [DomainEventModule, PrismaModule],
})
export class MailModule {}
