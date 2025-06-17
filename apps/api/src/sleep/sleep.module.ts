import { Module } from "@nestjs/common";
import { SleepController } from "./sleep.controller";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { PrismaSleep } from "./repository/sleep.prisma";
import { SleepService } from "./sleep.service";
import { BedManaging } from "@overbookd/sleep";

@Module({
  controllers: [SleepController],
  providers: [
    {
      provide: PrismaSleep,
      useFactory: (prisma: PrismaService) => new PrismaSleep(prisma),
      inject: [PrismaService],
    },
    {
      provide: BedManaging,
      useFactory: (beds: PrismaSleep) => {
        return new BedManaging(beds);
      },
      inject: [PrismaSleep],
    },
    {
      provide: SleepService,
      useFactory: (bedManaging: BedManaging) => {
        return new SleepService(bedManaging);
      },
      inject: [BedManaging],
    },
  ],
  imports: [PrismaModule],
  exports: [SleepService],
})
export class SleepModule {}
