import { Module } from "@nestjs/common";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { MailService } from "./mail.service";
import { PrismaMembers } from "./repository/members.prisma";

@Module({
  imports: [PrismaModule, DomainEventModule],
  providers: [
    {
      provide: PrismaMembers,
      useFactory: (prisma: PrismaService) => new PrismaMembers(prisma),
      inject: [PrismaService],
    },
    MailService,
  ],
  exports: [MailService, PrismaMembers],
})
export class MailModule {}
