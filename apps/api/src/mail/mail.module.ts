import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { PrismaMembers } from "./repository/members.prisma";
import { PrismaService } from "../prisma.service";
import { PrismaModule } from "../prisma.module";
import { DomainEventModule } from "../domain-event/domain-event.module";

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
