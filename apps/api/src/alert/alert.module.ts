import { Module } from "@nestjs/common";
import { AlertController } from "./alert.controller";
import { PrismaModule } from "../prisma.module";
import { PrismaAdherents } from "./adherents.prisma";
import { PrismaService } from "../prisma.service";
import { InDebtAlerting } from "@overbookd/personnal-account";
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
      provide: InDebtAlerting,
      useFactory: (adherents: PrismaAdherents) => new InDebtAlerting(adherents),
      inject: [PrismaAdherents],
    },
    {
      provide: AlertService,
      useFactory: (inDebt: InDebtAlerting) => new AlertService(inDebt),
      inject: [InDebtAlerting],
    },
  ],
  exports: [InDebtAlerting],
})
export class AlertModule {}
