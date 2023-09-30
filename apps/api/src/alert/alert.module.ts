import { Module } from "@nestjs/common";
import { AlertController } from "./alert.controller";
import { PrismaModule } from "../prisma.module";
import { PrismaAdherents } from "./adherents.prisma";
import { PrismaService } from "../prisma.service";
import { PersonnalAccountAlerting } from "@overbookd/personnal-account";
import { AlertService } from "./alert.service";

@Module({
  controllers: [AlertController],
  imports: [PrismaModule],
  providers: [
    {
      provide: PrismaAdherents,
      useFactory: (prisma: PrismaService) => new PrismaAdherents(prisma),
      inject: [PrismaService],
    },
    {
      provide: PersonnalAccountAlerting,
      useFactory: (adherents: PrismaAdherents) =>
        new PersonnalAccountAlerting(adherents),
      inject: [PrismaAdherents],
    },
    {
      provide: AlertService,
      useFactory: (alerting: PersonnalAccountAlerting) =>
        new AlertService(alerting),
      inject: [PersonnalAccountAlerting],
    },
  ],
  exports: [PersonnalAccountAlerting],
})
export class AlertModule {}
